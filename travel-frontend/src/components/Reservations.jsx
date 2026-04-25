import './Reservations.css'

export default function Reservations({ items, onRemove }) {
  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h2>My Reservations</h2>
        <p>Flights you have saved for later</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No reservations yet</h3>
          <p>Go to your wishlist and find flights to save them here.</p>
        </div>
      ) : (
        <div className="reservations-list">
          {items.map((flight, idx) => (
            <div key={idx} className="reservation-card">
              <div className="res-header">
                <h3>{flight.city}</h3>
                <span className="res-price">{flight.price}</span>
              </div>
              <div className="res-details">
                <p><strong>Departure:</strong> {flight.departure}</p>
                <p><strong>Arrival:</strong> {flight.arrival}</p>
                <p><strong>Route:</strong> BEG → {flight.dest}</p>
              </div>
              <div className="res-actions">
                <button 
                  className="btn-primary"
                  onClick={() => window.open(flight.booking_link, '_blank')}
                >
                  Continue Booking
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => onRemove(flight.booking_link)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
