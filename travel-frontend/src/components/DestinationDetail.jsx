import './DestinationDetail.css'

export default function DestinationDetail({
  destination,
  onBack,
  onAddToWishlist,
  onFindFlights,
  isInWishlist
}) {
  return (
    <div className="destination-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Results
        </button>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            <span className="badge-text">AI Recommendation</span>
          </div>
          <h1 className="destination-title">{destination.city}</h1>
          <div className="match-indicator">
            <div className="match-bar-container">
              <div className="match-bar" style={{width: `${destination.match_percentage || 85}%`}}></div>
            </div>
            <span className="match-text">{destination.match_percentage || 85}% Match to Your Preferences</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="detail-grid">
          {/* Left Column */}
          <div className="detail-column left">
            {/* Why This Destination Card */}
            <section className="detail-section">
              <h2>✨ Why You'll Love It</h2>
              <p className="reason-text">
                {destination.reason || 'This destination perfectly matches your travel preferences based on your uploaded images and style choices.'}
              </p>
            </section>

            {/* Vibe Section */}
            {destination.primary_vibe && (
              <section className="detail-section">
                <h2>🎨 Travel Vibe</h2>
                <div className="vibe-card">
                  <p>{destination.primary_vibe}</p>
                </div>
              </section>
            )}

            {/* Tags Section */}
            {destination.extracted_tags && (
              <section className="detail-section">
                <h2>🏷️ Key Characteristics</h2>
                <div className="tags-container">
                  {destination.extracted_tags.map((tag, index) => (
                    <span key={index} className="tag-item">{tag}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - CTA Section */}
          <div className="detail-column right">
            <div className="cta-card">
              <h3>Ready to Plan Your Trip?</h3>
              <p>Save this destination to your wishlist or find flights now</p>

              <div className="action-buttons">
                <button
                  className={`btn-action ${isInWishlist ? 'active' : ''}`}
                  onClick={() => onAddToWishlist(destination)}
                  disabled={isInWishlist}
                >
                  {isInWishlist ? '✓ In Wishlist' : '♡ Add to Wishlist'}
                </button>

                <button
                  className="btn-action primary"
                  onClick={() => onFindFlights(destination)}
                >
                  ✈️ Find Flights
                </button>
              </div>

              <div className="info-box">
                <h4>ℹ️ Quick Tip</h4>
                <p>Click "Find Flights" to search for the best deals on Skyscanner</p>
              </div>
            </div>

            {/* Destination Stats (if available) */}
            <div className="stats-card">
              <h3>Destination Info</h3>
              <div className="stat-item">
                <span className="stat-label">Match Score</span>
                <span className="stat-value">{destination.match_percentage || 85}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AI Confidence</span>
                <span className="stat-value">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
