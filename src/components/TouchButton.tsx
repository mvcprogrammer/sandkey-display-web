import { useNavigate } from 'react-router'

interface TouchButtonProps {
  /** Route the button opens. */
  to: string
  /** Second line, under "Touch Here". */
  label: string
}

/** Frame and lettering colour, sampled from the buttons the old artwork drew into the photo. */
const FRAME = '#beaf86'

/** Face colour, sampled the same way. */
const FACE = '#38383a'

/**
 * One of the two buttons on the home screen.
 *
 * The old kiosk painted these into the aerial photograph and laid an image-map region over each.
 * They are real elements now, so they can sit anywhere on the photo without re-exporting it. A
 * div rather than a link because the site stylesheet makes every anchor transparent.
 */
export function TouchButton({ to, label }: TouchButtonProps): JSX.Element {
  const navigate = useNavigate()

  return (
    <div
      role="button"
      onClick={() => navigate(to)}
      style={{
        width: 400,
        padding: 10,
        borderRadius: 16,
        backgroundColor: FRAME,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        style={{
          borderRadius: 10,
          backgroundColor: FACE,
          color: FRAME,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '18px 0 16px',
          lineHeight: 1.15,
        }}
      >
        <div style={{ fontSize: 34 }}>Touch Here</div>
        <div style={{ fontSize: 22 }}>{label}</div>
      </div>
    </div>
  )
}
