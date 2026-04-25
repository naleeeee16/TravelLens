import { useState } from 'react'
import './Flights.css'

export default function Flights({ destination, onBack }) {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [originIata, setOriginIata] = useState('')
  const [flightDate, setFlightDate] = useState('')
  const [flightEndDate, setFlightEndDate] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!originIata || !flightDate) return
    
    setLoading(true)
    setError('')
    setHasSearched(true)
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          city: destination.city,
          iata: destination.closest_airport_iata,
          origin_iata: originIata,
          date: flightDate,
          date_end: flightEndDate || null
        })
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

  return (
    <div className="flights-container">
      <div className="flights-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Flights to {destination.city}</h2>
        <p>Find the best deals on Skyscanner</p>
      </div>

      {!hasSearched && (
        <form className="flight-search-form glass-panel" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Origin Airport (IATA Code)</label>
            <input 
              type="text" 
              placeholder="e.g. LHR, BEG, JFK" 
              value={originIata}
              onChange={(e) => setOriginIata(e.target.value.toUpperCase())}
              maxLength="3"
              required 
            />
          </div>
          <div className="form-group">
            <label>Earliest Departure Date</label>
            <input 
              type="date" 
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Latest Departure Date (Flexible window, max 5 days)</label>
            <input 
              type="date" 
              value={flightEndDate}
              min={flightDate}
              onChange={(e) => setFlightEndDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary large">Search Flights</button>
        </form>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Searching for the best deals across your dates...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn-secondary" onClick={() => setHasSearched(false)}>Try Again</button>
        </div>
      ) : hasSearched && flights.length === 0 ? (
        <div className="empty-state">
          <p>No flights found from {originIata} to {destination.city}.</p>
          <button className="btn-secondary" onClick={() => setHasSearched(false)}>Try Another Search</button>
        </div>
      ) : hasSearched ? (
        <>
          <div className="search-summary">
            <p>
              Showing flights from <strong style={{color: 'var(--accent-primary)'}}>{originIata}</strong> to <strong style={{color: 'var(--accent-primary)'}}>{flights.length > 0 ? flights[0].dest : destination.city}</strong> 
              {flightEndDate ? ` departing between ${flightDate} and ${flightEndDate}` : ` departing on ${flightDate}`}
            </p>
            <button className="btn-secondary small" onClick={() => setHasSearched(false)}>Change Search</button>
          </div>
          <div className="flights-list">
            {flights.map((flight, idx) => (
              <div key={idx} className="flight-card">
                <div className="flight-info">
                  <div className="flight-route">
                    <span className="airport">{originIata}</span>
                    <span className="arrow">→</span>
                    <span className="airport">{flight.dest}</span>
                  </div>
                  <div className="flight-times-wrapper">
                    <div className="flight-date-badge">{flight.flight_date}</div>
                    <div className="flight-times">
                      <span>{flight.departure}</span>
                      <span className="duration-line"></span>
                      <span>{flight.arrival}</span>
                    </div>
                  </div>
                  <div className="flight-stops">
                    {flight.is_direct ? 'Direct' : `${flight.stops} Stop(s)`}
                  </div>
                </div>
                <div className="flight-action">
                  <div className="flight-price">{flight.price}</div>
                  <button 
                    className="btn-primary small-btn" 
                    onClick={() => window.open(flight.booking_link, '_blank')}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
