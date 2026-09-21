import { useNavigate } from 'react-router-dom'
import { HOTSPOTS } from '../hotspots'

/**
 * The home screen: an aerial photograph of Sand Key with a clickable region over each building.
 *
 * The coordinates are absolute pixels, so the image is never scaled. An `area` is the only
 * element that gives irregular hit regions without JavaScript, which is why the 2009 markup used
 * one and why it is kept.
 */
export function ImageMap(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="main-content clear-fix">
      <img
        className="map-image"
        src="/Images/aerialsksouth.jpg"
        id="aerialsksouth_Image_Map"
        useMap="#m_aerialsksouth_Image_Map"
        alt=""
      />
      <map name="m_aerialsksouth_Image_Map" id="m_aerialsksouth_Image_Map">
        {HOTSPOTS.map((hotspot) => (
          <area
            key={`${hotspot.to}-${hotspot.coords}`}
            shape={hotspot.shape}
            coords={hotspot.coords}
            href={hotspot.to}
            alt={hotspot.alt}
            onClick={(event) => {
              // Keep the href so the region behaves like a link, but navigate in-app.
              event.preventDefault()
              navigate(hotspot.to)
            }}
          />
        ))}
      </map>
    </div>
  )
}
