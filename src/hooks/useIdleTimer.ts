import { useEffect, useRef } from 'react'

/** How long the kiosk waits before returning to the lock screen. Carried over from navigation.js. */
export const IDLE_TIMEOUT_MS = 180_000

/**
 * Returns the kiosk to the lock screen after a period with no interaction, and restarts the
 * countdown on every touch.
 *
 * The legacy version hung a single `setTimeout` off a jQuery click handler on `#body`, which meant
 * the timer survived navigation only because every screen was a full page load.
 */
export function useIdleTimer(onIdle: () => void, timeoutMs: number = IDLE_TIMEOUT_MS): void {
  const onIdleRef = useRef(onIdle)
  onIdleRef.current = onIdle

  useEffect(() => {
    let timer: number

    const restart = (): void => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => onIdleRef.current(), timeoutMs)
    }

    restart()

    // Touch and pointer both fire on the kiosk glass; keydown covers the on-screen keyboard.
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchstart', 'keydown']
    events.forEach((event) => window.addEventListener(event, restart, { passive: true }))

    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, restart))
    }
  }, [timeoutMs])
}
