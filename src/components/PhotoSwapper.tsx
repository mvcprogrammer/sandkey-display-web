import { useEffect, useState } from 'react'
import type { Media } from '../api/types'

/**
 * Tracks which photo is enlarged.
 *
 * The main photo and the thumbnail strip are not adjacent in the detail layout - the property and
 * feature panels sit between them - so the state lives here rather than inside one component.
 *
 * The legacy version fetched each photo as an array buffer and turned it into a blob URL, a
 * workaround for photos being proxied through the application tier. They now come from the CDN
 * under the same origin, so swapping one is a state change.
 */
export function usePhotoSwapper(media: Media[]): {
  selected: string
  select: (url: string) => void
} {
  const [selected, setSelected] = useState(media[0]?.url ?? '')

  useEffect(() => setSelected(media[0]?.url ?? ''), [media])

  return { selected, select: setSelected }
}

/** The enlarged photo at the top of the detail screen. */
export function MainPhoto({ url }: { url: string }): JSX.Element {
  return (
    <div className="property-photo" id="property-photo-main">
      {url === '' ? null : <img style={{ height: 395 }} id="id_photo_holder" src={url} alt="" />}
    </div>
  )
}

interface PhotoThumbnailsProps {
  media: Media[]
  onSelect: (url: string) => void
}

/** The strip of thumbnails below the feature panels. */
export function PhotoThumbnails({ media, onSelect }: PhotoThumbnailsProps): JSX.Element {
  return (
    <div className="property-photo-area-small">
      {media.map((photo) => (
        <div key={photo.url}>
          <img
            className="property-photo-small"
            style={{ border: '1px solid #FFFFFF', cursor: 'pointer' }}
            src={photo.url}
            alt="Loading..."
            width={110}
            onClick={() => onSelect(photo.url)}
          />
        </div>
      ))}
    </div>
  )
}
