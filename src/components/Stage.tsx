import { useLayoutEffect, useState, type ReactNode } from 'react'

/** The glass the kiosk was built for. Every panel in site.css is sized against these. */
export const KIOSK_WIDTH = 1920
export const KIOSK_HEIGHT = 1080

/** The element overlays portal into when the stage is scaled, so they scale with it. */
export const STAGE_ID = 'kiosk-stage'

interface Fit {
  /** Multiplier applied to the 1920×1080 stage. */
  scale: number
  /** Offsets that centre the scaled stage in the window. */
  left: number
  top: number
  /** True on the kiosk itself: the stage is not used and nothing changes. */
  native: boolean
}

/**
 * Decides whether to scale.
 *
 * The office kiosk is always 1920 wide, with or without browser chrome, so width alone is the
 * test. Anything else (a laptop, a phone, an iframe on a portfolio page) gets the whole screen
 * scaled to fit, letterboxed, with its proportions kept.
 */
function measure(): Fit {
  const width = window.innerWidth
  const height = window.innerHeight
  if (width === KIOSK_WIDTH) {
    return { scale: 1, left: 0, top: 0, native: true }
  }
  const scale = Math.min(width / KIOSK_WIDTH, height / KIOSK_HEIGHT)
  return {
    scale,
    left: Math.round((width - KIOSK_WIDTH * scale) / 2),
    top: Math.round((height - KIOSK_HEIGHT * scale) / 2),
    native: false,
  }
}

/**
 * Fits the kiosk to any window.
 *
 * On the kiosk this renders its children directly and adds nothing to the DOM. Elsewhere it
 * wraps them in a fixed 1920×1080 box inside a window-sized backdrop and applies a CSS transform, so the layout the office
 * knows is rendered at its true size and then shrunk (or grown) as one picture. Touch and click
 * coordinates are mapped through the transform by the browser, so every control keeps working.
 */
export function Stage({ children }: { children: ReactNode }): JSX.Element {
  const [fit, setFit] = useState<Fit>(measure)

  useLayoutEffect(() => {
    const onResize = (): void => setFit(measure())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (fit.native) {
    return <>{children}</>
  }

  // The backdrop covers the window and clips, so the page never scrolls and the letterbox is
  // plain. Both are ordinary rendered elements: nothing is done to <body>, and there is no
  // effect to wait for, so the first paint is already right.
  return (
    <div className="kiosk-backdrop">
      <div
        id={STAGE_ID}
        className="kiosk-stage"
        style={{ left: fit.left, top: fit.top, transform: `scale(${fit.scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
