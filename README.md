# sandkey-display-web

The screen of a touch-screen property kiosk in a Clearwater Beach real estate office. It shows an
aerial photograph of Sand Key with two buttons, sales and rentals, and lets a visitor browse
listings, look at photos, and ask to be emailed details or called back.

The backend is `SandKey.Api.Display`.

## Running it

```bash
npm install
node mock/server.mjs   # fixture API on :5036
npm run dev            # kiosk on :5173
```

Open <http://localhost:5173> at a 1920×1080 viewport. The layout is fixed to that size — this is a
kiosk behind a pane of glass, not a responsive site.

`mock/server.mjs` serves fixtures captured from the live kiosk, so the screens can be developed and
compared without MLS credentials. To run against the real API instead, start it on `:5036` and skip
the mock. `/api` is proxied by the dev server, standing in for the CloudFront behaviour that
serves it in production. Photos are absolute Bridge CDN URLs and load directly in both.

```bash
npm run build          # production bundle into dist/
npm run typecheck
```

## This is a port, not a redesign

The kiosk has looked the same since 2013 and the office knows it by muscle memory, so the rebuild
reproduces it rather than reinterpreting it. Three things make that concrete:

**`src/styles/site.css` is the original stylesheet**, carried over with one change: image URLs were
made absolute (`/Images/…` rather than `../Images/…`), because the stylesheet is now bundled to
`/assets/` and the relative paths only resolved by accident of directory depth. Every class name
is unchanged, and the components use those class names rather than new ones.

**Bootstrap 5.1.0 is pinned as a dependency and loaded for its reboot, not its components.** None
of its classes are used. The layout was built in 2013 against a page where Bootstrap set
`box-sizing: border-box`, and every panel is sized in absolute pixels, so removing it moves things.
It is the obvious first candidate for removal once the stylesheet is modernised.

**`golden/pages/` holds twelve screens captured from the live kiosk** before any of this was
written — both property types, both sort directions, a second page, a partial result set, and a
detail page. They are the reference the port is checked against, and `mock/extract-fixtures.mjs`
builds the development fixtures out of them, so the fixture data is data that was really on the
screen.

The geometry of the on-screen keyboard and keypad lives in `src/components/keyboardLayout.ts`, one
entry per key. Both sit on a background image that draws the key faces, so the widths and margins
have to line up with the artwork to the pixel. None of those numbers are arbitrary.

### Deliberate departures

Seven, and no others:

| | |
|---|---|
| **Bedroom and bathroom pluralisation** | The legacy views had the test inverted — `BedroomsTotal > 1 ? "Bed" : "Beds"` — so the live kiosk reads "3 Bed" and "1 Beds". Corrected. This is the only visible text that differs from the old screen. |
| **Rental listings open the rental detail route** | Both legacy views tagged their tiles `residential_listing_data`, so the rental handler in `navigation.js` never fired and a rental opened `/Residential/Details/…`. It happened to work because both routes look up the same key. Rentals now use `rental_listing_data` and their own route. Neither class carries any styling, so nothing moves. |
| **Photos are not proxied** | `photo_swap.js` fetched each photo as an array buffer and rebuilt it as a blob URL, a workaround for photos being served through the application tier. They now load straight from the Bridge CDN, so swapping one is a state change. |
| **Previous on the first page stays on the first page** | The legacy link pointed at page −1 and the controller silently clamped it. The button is still there and still in the same place; it just no longer asks for a page that cannot exist. |
| **The home screen has no building selection** | The old photo carried a touchable region over each condominium, a "(or touch a building)" line, and the two buttons painted into the top-right corner. On 2026-09-22 the office asked for the building option to go, because visitors found it confusing, and for the buttons to sit in the middle of the screen. The buttons are real elements now, drawn in the artwork's colours over the clean photograph, and the condo screen and its routes are gone. |
| **The results grid says "Loading..." while the API answers** | The legacy kiosk was a server-rendered page, so the visitor stared at the home screen until the listings arrived. The port navigates at once and the grid stood empty until the response came back, which on the first request after an idle spell is a couple of seconds while the Lambda starts. The grid now shows "Loading..." in orange until the listings arrive. The text was first set at the 18px size of the card captions and was easy to miss on the kiosk, so it and the grid's error message are now 72px and vertically centred in the empty grid. Added 2026-09-24, enlarged 2026-09-27. |
| **Listings default to lowest price first** | The legacy kiosk opened every grid highest price first. The office asked for the reverse on 2026-09-22, so a route with no sort segment, and the two buttons on the condo screen, now sort ascending. The two sort buttons under the grid are unchanged, and `/Residential/2/…` still means descending. |

Two oddities in the original were reproduced rather than fixed, because fixing them would move the
layout. `<div class="clear:both;">` appears in the results grid where a style was clearly intended:
written as a class it matches no rule and never clears the floated photo, which is why the detail
text sits beside the photo rather than under it. Those divs are still inert here, and commented to
say so. The shift keys on the email keyboard are likewise still inert — they fell through their
`switch` case in the original too.

## Structure

```
src/
  api/          client.ts, types.ts  — mirrors the API contract
  components/   TouchButton, ListingCard, NavigationBar, PhotoSwapper,
                OnScreenKeyboard, NumPad, KeyRowView, Modal, keyboardLayout
  hooks/        useIdleTimer (3 minutes to the lock screen), useAsync
  pages/        Home, Locked, Listings, Detail
  format.ts     price, area and pluralisation, in one place
```

Routes keep the legacy shape, so `/Residential/2/1` still means descending, page one. The third
segment that named a condominium went with the building selection.

`Modal` replaces jquery.bpopup, keeping its 650ms timing and both of its transitions.
`useIdleTimer` replaces the global `setTimeout` in `navigation.js`; the three-minute timeout and
the return to `/Home/Locked` are unchanged, but the timer now survives navigation rather than
relying on every screen being a full page load.

## Verifying it against the old kiosk

The structural check is automated: every class name the live kiosk renders is present in `src/`,
checked against the golden captures. The visual check is not — put the two side by side at
1920×1080 and walk the path: home → listings → detail → email → back → idle three minutes →
lock screen → touch → home. The home screen itself no longer matches the capture, by request.
