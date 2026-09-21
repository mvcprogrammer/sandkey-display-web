import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ListingType } from './api/types'
import { useIdleTimer } from './hooks/useIdleTimer'
import { CondoPage } from './pages/CondoPage'
import { DetailPage } from './pages/DetailPage'
import { HomePage } from './pages/HomePage'
import { ListingsPage } from './pages/ListingsPage'
import { LockedPage } from './pages/LockedPage'

/**
 * The kiosk shell.
 *
 * Routes are the ones the legacy application served, unchanged, so every link in the image map
 * and every path the office knows still resolves. `/Residential/2/1/100` is descending, page one,
 * Landmark Towers.
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

      <Route path="/Condo/:condoId" element={<CondoPage />} />

      <Route path="/Residential/Details/:listingKey" element={<DetailPage />} />
      <Route
        path="/Residential/:order?/:page?/:condoId?"
        element={<ListingsPage type={ListingType.Sale} basePath="/Residential" />}
      />

      <Route path="/Rental/Details/:listingKey" element={<DetailPage />} />
      <Route
        path="/Rental/:order?/:page?/:condoId?"
        element={<ListingsPage type={ListingType.Lease} basePath="/Rental" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
