import { useNavigate, useParams } from 'react-router-dom'
import { getCondos } from '../api/client'
import { useAsync } from '../hooks/useAsync'

/**
 * The screen between the map and the results: pick sales or rentals for one condominium.
 *
 * The legacy view gave both buttons the same `id` attribute - the condo id - and read it back in
 * a click handler. The id travels in the route here instead, so the document has no duplicates.
 */
export function CondoPage(): JSX.Element {
  const { condoId } = useParams()
  const navigate = useNavigate()
  const id = Number(condoId ?? 0)
  const { data } = useAsync((signal) => getCondos(signal), [])

  const name = data?.items.find((condo) => condo.id === id)?.name ?? ''

  return (
    <div style={{ height: 1078, width: 1920 }}>
      <div
        className="condoHeader"
        style={{
          width: 950,
          margin: 'auto',
          fontFamily: 'Arial,serif',
          fontSize: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            padding: '10px 15px',
            margin: 'auto',
            backgroundColor: 'transparent',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#FFFFFF',
          }}
        >
          {name}
        </div>
        <div
          className="class_residential_selector"
          onClick={() => navigate(`/Residential/1/0/${id}`)}
          style={{
            backgroundColor: 'transparent',
            padding: '72px 15px',
            width: 412,
            height: 45,
            margin: '55px 5px',
            float: 'left',
            backgroundImage: "url('/Images/SalesInformation.png')",
            cursor: 'pointer',
          }}
        >
          {' '}
        </div>
        <div
          className="class_rental_selector"
          onClick={() => navigate(`/Rental/1/0/${id}`)}
          style={{
            backgroundColor: 'transparent',
            padding: '72px 15px',
            width: 412,
            height: 45,
            margin: '55px 5px',
            float: 'right',
            backgroundImage: "url('/Images/RentalInformation.png')",
            cursor: 'pointer',
          }}
        >
          {' '}
        </div>
        <div
          id="id_nav_back"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            padding: '35px 15px',
            width: 414,
            height: 146,
            margin: 'auto',
            clear: 'both',
            backgroundImage: "url('/Images/GoBack.png')",
            cursor: 'pointer',
          }}
        >
          {' '}
        </div>
      </div>
    </div>
  )
}
