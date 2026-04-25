import { useState, useEffect } from 'react'
import './Flights.css'

export default function Flights({ destination, onBack, onSaveReservation }) {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city: destination.city })
        })
        const data = await response.json()
        if (response.ok) {
          setFlights(data.flights || [])
        } else {
          setError(data.error || 'Failed to fetch flights.')
        }
      } catch (err) {
        setError('Could not connect to the backend server.')
      } finally {
        setLoading(false)
      }
    }
    fetchFlights()
  }, [destination.city])

  return (
    <div className="flights-container">
      <div className="flights-header">
        <button className="btn-back" onClick={onBack}>← Back to Wishlist</button>
        <h2>Flights to {destination.city}</h2>
        <p>Top 10 cheapest flights found on Skyscanner</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Searching for the best deals...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="empty-state">
          <p>No flights found for {destination.city}.</p>
        </div>
      ) : (
        <div className="flights-list">
          {flights.map((flight, idx) => (
            <div key={idx} className="flight-card">
              <div className="flight-info">
                <div className="flight-route">
                  <span className="airport">BEG</span>
                  <span className="arrow">→</span>
                  <span className="airport">{flight.dest}</span>
                </div>
                <div className="flight-times">
                  <span>{flight.departure}</span>
                  <span className="duration-line"></span>
                  <span>{flight.arrival}</span>
                </div>
                <div className="flight-stops">
                  {flight.is_direct ? 'Direct' : `${flight.stops} Stop(s)`}
                </div>
              </div>
              <div className="flight-action">
                <div className="flight-price">{flight.price}</div>
                <button 
                  className="btn-primary" 
                  onClick={() => window.open(flight.booking_link, '_blank')}
                >
                  Book
                </button>
                <button 
                  className="btn-secondary btn-save" 
                  onClick={() => onSaveReservation({...flight, city: destination.city})}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
