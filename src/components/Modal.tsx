import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Transition duration the legacy bPopup calls used. */
const TRANSITION_MS = 650

/** How the dialog enters. */
export type ModalTransition = 'slideIn' | 'fadeIn'

interface ModalProps {
  open: boolean
  transition?: ModalTransition
  onClose: () => void
  children: ReactNode
}

/**
 * A centred dialog over a dimmed page.
 *
 * Replaces jquery.bpopup, keeping its 650ms timing and its two transitions so the keyboard and
 * the thank-you message appear exactly as they did.
 *
 * The dialog is portalled to `document.body`, which is where bPopup appended it (`appendTo:
 * 'body'` was its default). That matters for the keyboard: the detail page sets white text, and
 * the key labels are only legible on the grey key artwork because they inherit the body's dark
 * colour instead.
 */
export function Modal({ open, transition = 'fadeIn', onClose, children }: ModalProps): JSX.Element | null {
  const [mounted, setMounted] = useState(open)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // A frame later, so the entering styles are applied as a transition rather than instantly.
      const frame = window.requestAnimationFrame(() => setEntered(true))
      return () => window.cancelAnimationFrame(frame)
    }

    setEntered(false)
    const timer = window.setTimeout(() => setMounted(false), TRANSITION_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  if (!mounted) {
    return null
  }

  return createPortal(
    <div
      className="modal-backdrop-kiosk"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: entered ? 1 : 0,
        transition: `opacity ${TRANSITION_MS}ms ease`,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          opacity: entered ? 1 : 0,
          transform: transition === 'slideIn' && !entered ? 'translateY(-100vh)' : 'translateY(0)',
          transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
