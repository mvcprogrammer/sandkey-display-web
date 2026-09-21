import { useNavigate } from 'react-router-dom'
import type { ListingSummary } from '../api/types'
import { formatArea, formatListingPrice, isLease, pluralize } from '../format'

interface ListingCardProps {
  listing: ListingSummary
}

/** Every listing on the kiosk is on Clearwater Beach; the legacy view hard-coded both of these. */
const PLACE = 'Clearwater Beach'
const COUNTY = 'Pinellas'

/**
 * One tile in the results grid. Class names are carried over from the 2013 stylesheet unchanged,
 * so the tile lays out exactly as it did.
 */
export function ListingCard({ listing }: ListingCardProps): JSX.Element {
  const navigate = useNavigate()
  const detailPath = isLease(listing.propertyType) ? '/Rental/Details' : '/Residential/Details'

  return (
    <div className="property_listing">
      <div
        className={isLease(listing.propertyType) ? 'rental_listing_data' : 'residential_listing_data'}
        onClick={() => navigate(`${detailPath}/${listing.listingKey}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="property_listing_data_header">
          <div className="property_listing_data_header_place_price_container">
            <div className="property_listing_data_header_place">{PLACE}</div>
            <div className="property_listing_data_header_price">
              {formatListingPrice(listing.listPrice, listing.propertyType)}
            </div>
          </div>
          <div className="property_listing_data_header_address">{listing.subdivisionName}</div>
          <div style={{ clear: 'both' }} />
        </div>
        <div className="property_listing_data_details">
          <div className="property_listing_data_details_photos">
            {listing.primaryPhoto === null ? (
              <span>Photo not available.</span>
            ) : (
              <img width="160" height="120" src={listing.primaryPhoto.url} alt="" />
            )}
          </div>
          {/* Inert in the original: written as a class, not a style, so it never cleared
              the floated photo. Reproduced as-is because a real clear drops the text below it. */}
          <div className="clear:both;" />
          <div className="property_listing_data_details_info">{listing.propertyType}</div>
          <div className="property_listing_data_details_bed_bath">
            {listing.bedroomsTotal}&nbsp;{pluralize(listing.bedroomsTotal, 'Bed')} |{' '}
            {listing.bathroomsFull}&nbsp;Full {pluralize(listing.bathroomsFull, 'Bath')}
          </div>
          <div className="property_listing_data_details_SF">
            Living Area:&nbsp;{formatArea(listing.livingArea)} Sq. Ft.
          </div>
          <div className="property_listing_data_details_county">{COUNTY}</div>
          <div className="property_listing_data_details_mls_id">{listing.propertySubType}</div>
        </div>
        <div className="property_listing_data_touch_here">Touch for more information.</div>
      </div>
    </div>
  )
}
