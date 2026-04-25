import './Wishlist.css'

export default function Wishlist({
  items,
  onRemove,
  onFindFlights,
  onViewDetail
}) {
  return (
    <div className="wishlist-container">
      {/* Header */}
      <div className="wishlist-header">
        <h2>💖 My Travel Wishlist</h2>
        <p>{items.length} destination{items.length !== 1 ? 's' : ''} saved</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💭</div>
          <h3>No destinations yet</h3>
          <p>Go back to discover and add destinations to your wishlist</p>
        </div>
      ) : (
        <div className="wishlist-content">
          {/* Summary Stats */}
          <div className="wishlist-stats">
            <div className="stat-box">
              <span className="stat-icon">🌍</span>
              <div>
                <p className="stat-label">Total Destinations</p>
                <p className="stat-value">{items.length}</p>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">⭐</span>
              <div>
                <p className="stat-label">Average Match</p>
                <p className="stat-value">
                  {Math.round(items.reduce((sum, d) => sum + (d.match_percentage || 85), 0) / items.length)}%
                </p>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">✈️</span>
              <div>
                <p className="stat-label">Ready to Book</p>
                <p className="stat-value">{items.length}</p>
              </div>
            </div>
          </div>

          {/* Wishlist Items Table */}
          <div className="wishlist-table-wrapper">
            <table className="wishlist-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Match Score</th>
                  <th>Vibe</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((destination, index) => (
                  <tr key={index} className="wishlist-row">
                    <td className="destination-cell">
                      <div className="destination-info">
                        <h4>{destination.city}</h4>
                        <p className="destination-desc">
                          {destination.reason && destination.reason.substring(0, 60)}...
                        </p>
                      </div>
                    </td>
                    <td className="score-cell">
                      <div className="score-badge">
                        {destination.match_percentage || 85}%
                      </div>
                    </td>
                    <td className="vibe-cell">
                      <span className="vibe-tag">
                        {destination.primary_vibe || 'Travel Experience'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon view"
                        onClick={() => onViewDetail(destination)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-icon flights"
                        onClick={() => onFindFlights(destination)}
                        title="Find Flights"
                      >
                        ✈️
                      </button>
                      <button
                        className="btn-icon remove"
                        onClick={() => onRemove(destination.city)}
                        title="Remove from Wishlist"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Bar */}
          <div className="wishlist-actions">
            <button className="btn-primary large">
              📋 Export Wishlist
            </button>
            <button className="btn-secondary large">
              ✈️ Book All Flights
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
