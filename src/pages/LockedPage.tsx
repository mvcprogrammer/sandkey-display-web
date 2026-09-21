import { useNavigate } from 'react-router-dom'

/**
 * The screen the kiosk falls back to after three minutes of inactivity. Touching it anywhere
 * returns to the map.
 */
export function LockedPage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="main-content clear-fix">
      <img
        className="map-image"
        src="/Images/sandkey-display-locked.jpg"
        alt="Touch to begin"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      />
    </div>
  )
}
