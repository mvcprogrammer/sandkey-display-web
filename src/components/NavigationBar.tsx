import { Link } from 'react-router-dom'
import { SortDirection } from '../api/types'

interface NavigationBarProps {
  /** Route prefix for this listing type: `/Residential` or `/Rental`. */
  basePath: string
  order: SortDirection
  page: number
  /** Whether a further page exists. The legacy kiosk had no way to know. */
  hasMore: boolean
}

/** Maps a sort direction onto the numeric route segment the legacy URLs used. */
const ORDER_SEGMENT: Record<SortDirection, number> = {
  [SortDirection.Ascending]: 1,
  [SortDirection.Descending]: 2,
}

/**
 * The five navigation buttons under the results grid.
 *
 * Previous on the first page links back to the first page rather than to page minus one. The
 * legacy controller clamped a negative page server-side, which hid the fact that the link was
 * wrong; clamping it here keeps the button in place and the request valid.
 */
export function NavigationBar({
  basePath,
  order,
  page,
  hasMore,
}: NavigationBarProps): JSX.Element {
  const orderSegment = ORDER_SEGMENT[order]
  const previousPage = Math.max(0, page - 1)
  const nextPage = hasMore ? page + 1 : page

  return (
    <div className="Navigation_Container">
      <div className="Navigate_Prev">
        <Link to={`${basePath}/${orderSegment}/${previousPage}`}>
          <img src="/Images/Prev.png" alt="Navigate Previous" />
        </Link>
      </div>
      <div className="Navigate_Home">
        <Link to="/">
          <img src="/Images/Home.png" alt="Navigate Home" />
        </Link>
      </div>
      <div className="Navigate_Next">
        <Link to={`${basePath}/${orderSegment}/${nextPage}`}>
          <img src="/Images/Next.png" alt="Navigate Next" />
        </Link>
      </div>
      <div className="Navigate_SortHighToLow">
        <Link to={`${basePath}/${ORDER_SEGMENT[SortDirection.Descending]}/0`}>
          <img src="/Images/SortHighToLow.png" alt="Sort Descending" />
        </Link>
      </div>
      <div className="Navigate_SortLowToHigh">
        <Link to={`${basePath}/${ORDER_SEGMENT[SortDirection.Ascending]}/0`}>
          <img src="/Images/SortLowToHigh.png" alt="Sort Ascending" />
        </Link>
      </div>
    </div>
  )
}
