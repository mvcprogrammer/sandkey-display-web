/**
 * Builds API fixtures from the golden captures of the live kiosk.
 *
 * This lets the kiosk be developed and visually checked without MLS credentials, and keeps the
 * fixture data honest: every listing here was really on the screen on the day it was captured.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const goldenDir = join(here, '..', 'golden', 'pages')

/** Pulls the inner text of the first match of a pattern, or an empty string. */
const text = (html, pattern) => (html.match(pattern)?.[1] ?? '').trim()

/** Parses one listing tile out of a captured results page. */
function parseTile(tile) {
  const price = text(tile, /property_listing_data_header_price">([^<]*)</)
  const beds = text(tile, /property_listing_data_details_bed_bath">(\d+)/)
  const baths = text(tile, /property_listing_data_details_bed_bath">[^|]*\|\s*(\d+)/)
  const area = text(tile, /Living Area:&nbsp;([\d,]+)/)
  const photo = text(tile, /src="(\/photo\/[^"]*)"/)

  return {
    listingKey: text(tile, /id="([0-9a-f]{32})"/),
    listPrice: Number(price.replace(/[^0-9]/g, '')),
    subdivisionName: text(tile, /property_listing_data_header_address">([^<]*)</),
    propertyType: text(tile, /property_listing_data_details_info">([^<]*)</),
    propertySubType: text(tile, /property_listing_data_details_mls_id">([^<]*)</),
    bedroomsTotal: Number(beds),
    bathroomsFull: Number(baths),
    livingArea: Number(area.replace(/,/g, '')),
    primaryPhoto: photo === '' ? null : { order: 0, url: photo.replace('/photo/', '/media/') },
  }
}

/** Parses every listing tile on a captured results page. */
function parsePage(name) {
  const html = readFileSync(join(goldenDir, `${name}.html`), 'utf8')
  const tiles = html.split('<div class="property_listing">').slice(1)

  return tiles.map(parseTile).filter((listing) => listing.listingKey !== '')
}

const sale = parsePage('residential-page1')
const salePage2 = parsePage('residential-page2')
const saleAscending = parsePage('residential-asc')
const saleCondo100 = parsePage('residential-condo100')
const lease = parsePage('rental-page1')
const leaseCondo117 = parsePage('rental-condo117')

const fixtures = { sale, salePage2, saleAscending, saleCondo100, lease, leaseCondo117 }

writeFileSync(join(here, 'fixtures.json'), `${JSON.stringify(fixtures, null, 2)}\n`)

for (const [name, listings] of Object.entries(fixtures)) {
  console.log(`${name.padEnd(16)} ${String(listings.length).padStart(2)} listings`)
}

// The detail screen has its own capture; parse it into a single listing fixture.
const detailHtml = readFileSync(join(goldenDir, 'residential-detail.html'), 'utf8')

const rightCol = (label) => {
  const pattern = new RegExp(
    `property-info-left-col">${label}:</div><div class="property-info-right-col">&nbsp;([^<]*)<`,
  )
  return (detailHtml.match(pattern)?.[1] ?? '').trim()
}

const featureCol = (label) => {
  const pattern = new RegExp(
    `property-features-left-col">${label}:</div><div class="property-features-right-col">&nbsp;([^<]*)<`,
  )
  const value = (detailHtml.match(pattern)?.[1] ?? '').trim()
  return value === '' ? [] : value.split(',').map((item) => item.trim())
}

const photos = [...detailHtml.matchAll(/class="property-photo-small" id="(\/photo\/[^"]*)"/g)].map(
  (match, index) => ({ order: index, url: match[1].replace('/photo/', '/media/') }),
)

const bathrooms = rightCol('Bathrooms')
const garage = featureCol('Garage')[0] ?? 'Unspecified'

const detail = {
  listingKey: text(detailHtml, /class="property-background" id="([0-9a-f]{32})"/),
  listingId: 'TB8412345',
  listPrice: Number(rightCol('Price').replace(/[^0-9]/g, '')),
  subdivisionName: text(detailHtml, /class="property-address">([^<]*)</),
  unparsedAddress: '1 Somewhere Drive, Clearwater Beach, FL 33767',
  propertyType: 'Residential',
  propertySubType: rightCol('Type'),
  bedroomsTotal: Number(rightCol('Bedrooms')),
  bathroomsFull: Number(bathrooms.match(/(\d+) Full/)?.[1] ?? 0),
  bathroomsHalf: Number(bathrooms.match(/(\d+) Half/)?.[1] ?? 0),
  livingArea: Number(rightCol('Living Area').replace(/[^0-9]/g, '')),
  yearBuilt: Number(rightCol('Year Built')),
  hasGarage: garage === 'Yes' ? true : garage === 'No' ? false : null,
  isWaterfront: true,
  publicRemarks: text(detailHtml, /class="public-remarks">([\s\S]*?)<\/div>/),
  listOfficeName: text(detailHtml, /Listing details provided by ([^<]*)</),
  petsAllowed: featureCol('Pets'),
  exteriorFeatures: featureCol('Exterior'),
  poolFeatures: featureCol('Pool'),
  interiorFeatures: featureCol('Interior'),
  waterfrontFeatures: (text(detailHtml, /waterfront-info-right-col">&nbsp;([^<]*)</) || '')
    .split(',')
    .filter((item) => item !== ''),
  communityFeatures: featureCol('Community'),
  media: photos,
  lastModified: '2026-07-19T23:11:41+00:00',
}
detail.publicRemarks = detail.publicRemarks
  .replace(/&#x27;/g, "'")
  .replace(/&#xD;&#xA;/g, "\n")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')


writeFileSync(join(here, 'detail.json'), `${JSON.stringify(detail, null, 2)}\n`)
console.log(`detail           ${detail.media.length} photos, ${detail.subdivisionName}`)
