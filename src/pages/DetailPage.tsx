import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ApiError, getListing, submitInquiry } from '../api/client'
import { Modal } from '../components/Modal'
import { NumPad } from '../components/NumPad'
import { OnScreenKeyboard } from '../components/OnScreenKeyboard'
import { MainPhoto, PhotoThumbnails, usePhotoSwapper } from '../components/PhotoSwapper'
import { formatArea, formatListingPrice } from '../format'
import { useAsync } from '../hooks/useAsync'

/** How long a status or thank-you message stays on screen, carried over from photo_swap.js. */
const MESSAGE_MS = 3000

/** Status text for each failure, matching the wording the office is used to. */
function statusForError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Bad request, Please verify your email...'
      case 404:
        return 'Error processing request, please try again...'
      case 429:
        return 'Too many requests, please try again shortly...'
      case 500:
        return 'ERROR, please try again...'
      default:
        return 'Send Failed, please try again...'
    }
  }

  return 'Send Failed, please try again...'
}

/** Renders a feature list the way the legacy view did, comma separated. */
function joinFeatures(features: string[], separator = ', '): string {
  return features.join(separator)
}

/** The listing detail screen. */
export function DetailPage(): JSX.Element {
  const { listingKey } = useParams()
  const navigate = useNavigate()

  const { data: listing, error } = useAsync(
    (signal) => getListing(listingKey ?? '', signal),
    [listingKey],
  )

  const media = listing?.media ?? []
  const { selected, select } = usePhotoSwapper(media)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [thankYou, setThankYou] = useState<'email' | 'phone' | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const timers = useRef<number[]>([])

  const later = useCallback((action: () => void) => {
    timers.current.push(window.setTimeout(action, MESSAGE_MS))
  }, [])

  const submit = useCallback(
    async (body: { emailAddress?: string; phoneNumber?: string }, kind: 'email' | 'phone') => {
      if (listing === null || submitting) {
        return
      }

      setSubmitting(true)
      setStatus(
        kind === 'email' ? 'Processing property info request...' : 'Processing contact request...',
      )

      try {
        await submitInquiry({ listingKey: listing.listingKey, ...body })

        setStatus(null)
        setEmailAddress('')
        setPhoneNumber('')
        setKeyboardOpen(false)
        setNumpadOpen(false)
        setThankYou(kind)
        later(() => setThankYou(null))
      } catch (failure) {
        setStatus(statusForError(failure))
        later(() => setStatus(null))
      } finally {
        setSubmitting(false)
      }
    },
    [later, listing, submitting],
  )

  if (error !== null) {
    return (
      <div className="property-background">
        <div className="property-background-layer-1">
          <div className="property-background-layer-2">
            <div className="public-remarks">
              This listing is no longer available. Please choose another.
            </div>
            <div id="id_property_go_back" className="property-go-back" onClick={() => navigate(-1)}>
              <span className="link-span" style={{ color: 'red' }}>
                Back
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (listing === null) {
    return <div className="property-background" />
  }

  const garage = listing.hasGarage === null ? 'Unspecified' : listing.hasGarage ? 'Yes' : 'No'

  return (
    <div className="property-background" id={listing.listingKey}>
      <div className="property-background-layer-1">
        <div className="property-background-layer-2">
          <MainPhoto url={selected} />
          <div className="property-info-right">
            <div className="property-address">{listing.subdivisionName}</div>
            <div className="propery-info-nav">
              <div
                id="id_property_go_back"
                className="property-go-back"
                onClick={() => navigate(-1)}
                style={{ cursor: 'pointer' }}
              >
                <span className="link-span" style={{ color: 'red' }}>
                  Back
                </span>
              </div>
              <div
                id="id_property_contact_phone"
                className="property-contact-phone"
                onClick={() => setNumpadOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                <span className="link-span">Contact Me by Phone</span>
              </div>
              <div
                id="id_show_keyboard"
                className="property-contact-email"
                onClick={() => setKeyboardOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                <span className="link-span">Send Details by Email</span>
              </div>
            </div>
            <div className="waterfront-information">
              <div className="waterfront-information-header">Waterfront Information</div>
              <div className="waterfront-information-details">
                <div className="waterfront-info-left-col">Type:</div>
                <div className="waterfront-info-right-col">
                  &nbsp;{joinFeatures(listing.waterfrontFeatures, ',')}
                </div>
              </div>
            </div>
            <div className="property-information">
              <div className="property-information-header">Property Information</div>
              <div className="property-information-details">
                <div className="property-info-left-col">Type:</div>
                <div className="property-info-right-col">&nbsp;{listing.propertySubType}</div>
                <div className="property-info-left-col">Bedrooms:</div>
                <div className="property-info-right-col">&nbsp;{listing.bedroomsTotal}</div>
                <div className="property-info-left-col">Bathrooms:</div>
                <div className="property-info-right-col">
                  &nbsp;{listing.bathroomsFull} Full, {listing.bathroomsHalf} Half
                </div>
                <div className="property-info-left-col">Year Built:</div>
                <div className="property-info-right-col">&nbsp;{listing.yearBuilt}</div>
                <div className="property-info-left-col">Living Area:</div>
                <div className="property-info-right-col">
                  &nbsp;{formatArea(listing.livingArea)} Sq. Ft.
                </div>
                <div className="property-info-left-col">Price:</div>
                <div className="property-info-right-col">
                  &nbsp;{formatListingPrice(listing.listPrice, listing.propertyType)}
                </div>
              </div>
            </div>
          </div>
          <div className="property-features">
            <div className="property-features-header">Features</div>
            <div className="property-features-left-col">Community:</div>
            <div className="property-features-right-col">
              &nbsp;{joinFeatures(listing.communityFeatures)}
            </div>
            <div className="property-features-left-col">Exterior:</div>
            <div className="property-features-right-col">
              &nbsp;{joinFeatures(listing.exteriorFeatures)}
            </div>
            <div className="property-features-left-col">Pool:</div>
            <div className="property-features-right-col">
              &nbsp;{joinFeatures(listing.poolFeatures)}
            </div>
            <div className="property-features-left-col">Garage:</div>
            <div className="property-features-right-col">&nbsp;{garage}</div>
            <div className="property-features-left-col">Interior:</div>
            <div className="property-features-right-col">
              &nbsp;{joinFeatures(listing.interiorFeatures)}
            </div>
            <div className="property-features-left-col">Pets:</div>
            <div className="property-features-right-col">
              &nbsp;{joinFeatures(listing.petsAllowed)}
            </div>
          </div>
          <div style={{ clear: 'left' }} />
          <PhotoThumbnails media={media} onSelect={select} />
          <div style={{ clear: 'both' }} />
          <div className="public-remarks">{listing.publicRemarks}</div>
          <div className="reprocity">
            IDX information provided by MFRMLS&reg; and is provided for personal non-commercial
            use. Data last refreshed on {new Date(listing.lastModified).toLocaleString('en-US')}.
            Listing details provided by {listing.listOfficeName}
          </div>
        </div>
      </div>

      <Modal open={keyboardOpen} transition="slideIn" onClose={() => setKeyboardOpen(false)}>
        <OnScreenKeyboard
          value={emailAddress}
          onChange={setEmailAddress}
          onSubmit={() => void submit({ emailAddress }, 'email')}
          onClose={() => {
            setEmailAddress('')
            setStatus(null)
            setKeyboardOpen(false)
          }}
          status={status}
          disabled={submitting}
        />
      </Modal>

      <Modal open={numpadOpen} transition="slideIn" onClose={() => setNumpadOpen(false)}>
        <NumPad
          value={phoneNumber}
          onChange={setPhoneNumber}
          onSubmit={() => void submit({ phoneNumber }, 'phone')}
          onClose={() => {
            setPhoneNumber('')
            setStatus(null)
            setNumpadOpen(false)
          }}
          disabled={submitting}
        />
      </Modal>

      <Modal open={thankYou !== null} transition="fadeIn" onClose={() => setThankYou(null)}>
        <div id={thankYou === 'phone' ? 'phone_thank_you' : 'email_thank_you'} style={{ backgroundColor: '#FFFFFF' }}>
          <p style={{ padding: 15, fontSize: 20 }}>
            {thankYou === 'phone'
              ? 'Thank you, Someone will contact you about this property shortly.'
              : 'Thank you, Your email with property details has been sent.'}
          </p>
        </div>
      </Modal>
    </div>
  )
}
