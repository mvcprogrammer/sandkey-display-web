import { Navigate, Route, Routes, useNavigate } from 'react-router'
import { ListingType } from './api/types'
import { useIdleTimer } from './hooks/useIdleTimer'
import { DetailPage } from './pages/DetailPage'
import { HomePage } from './pages/HomePage'
import { ListingsPage } from './pages/ListingsPage'
import { LockedPage } from './pages/LockedPage'

/**
 * The kiosk shell.
 *
 * Routes keep the legacy shape, so every path the office knows still resolves. `/Residential/2/1`
 * is descending, page one. The third segment the old kiosk used for a condominium is gone with
 * the building selection it served.
 */
export function App(): JSX.Element {
  const navigate = useNavigate()

  useIdleTimer(() => navigate('/Home/Locked'))

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/Home/Index" element={<HomePage />} />
      <Route path="/Home/Locked" element={<LockedPage />} />

      <Route path="/Residential/Details/:listingKey" element={<DetailPage />} />
      <Route
        path="/Residential/:order?/:page?"
        element={<ListingsPage type={ListingType.Sale} basePath="/Residential" />}
      />

      <Route path="/Rental/Details/:listingKey" element={<DetailPage />} />
      <Route
        path="/Rental/:order?/:page?"
        element={<ListingsPage type={ListingType.Lease} basePath="/Rental" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
