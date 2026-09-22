import { TouchButton } from '../components/TouchButton'

/**
 * The home screen: the aerial photograph with the two touch buttons centred over it.
 *
 * Until 2026-09-22 the photo also carried a touchable region over each condominium and the line
 * "(or touch a building)". The office asked for both to go, because visitors found the building
 * option confusing, and for the buttons to move to the middle of the screen.
 */
export function HomePage(): JSX.Element {
  return (
    <div className="main-content clear-fix" style={{ position: 'relative' }}>
      <img className="map-image" src="/Images/aerialsksouth.jpg" alt="" />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
        }}
      >
        <TouchButton to="/Residential/" label="For Sales Information" />
        <TouchButton to="/Rental/" label="For Rental Information" />
      </div>
    </div>
  )
}
