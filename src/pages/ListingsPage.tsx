import { useParams } from 'react-router-dom'
import { getListings } from '../api/client'
import { ListingType, SortDirection } from '../api/types'
import { ListingCard } from '../components/ListingCard'
import { NavigationBar } from '../components/NavigationBar'
import { useAsync } from '../hooks/useAsync'

interface ListingsPageProps {
  type: ListingType
  /** Route prefix for this listing type, kept as it was so the old URLs still resolve. */
  basePath: string
}

/**
 * The legacy routes numbered the sort direction; 1 is ascending and 2 is descending. A missing
 * segment means lowest price first, which the office asked for as the default.
 */
function toSortDirection(segment: string | undefined): SortDirection {
  return segment === '2' ? SortDirection.Descending : SortDirection.Ascending
}

/**
 * The results grid, nine listings to a page.
 *
 * The route shape is carried over from the legacy application - `/Residential/2/1` is
 * descending, page one - so the office's muscle memory still works. The filters reach the API as
 * query parameters.
 */
export function ListingsPage({ type, basePath }: ListingsPageProps): JSX.Element {
  const { order: orderSegment, page: pageSegment } = useParams()

  const order = toSortDirection(orderSegment)
  const page = Math.max(0, Number(pageSegment ?? 0) || 0)

  const { data, error, loading } = useAsync(
    (signal) => getListings({ type, order, page }, signal),
    [type, order, page],
  )

  return (
    <>
      <div className="property_container">
        {loading && data === null ? null : null}
        {error !== null ? (
          <div className="property_listing_data_touch_here">
            Listings are unavailable at the moment. Please try again shortly.
          </div>
        ) : (
          (data?.items ?? []).map((listing) => (
            <ListingCard key={listing.listingKey} listing={listing} />
          ))
        )}
        {/* Inert in the original, as above. */}
        <div className="clear:both;" />
      </div>
      <NavigationBar
        basePath={basePath}
        order={order}
        page={page}
        hasMore={data?.hasMore ?? false}
      />
    </>
  )
}
