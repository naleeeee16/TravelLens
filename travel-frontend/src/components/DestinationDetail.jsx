import { useState, useEffect } from 'react'
import './DestinationDetail.css'

function DetailHero({ destination }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!destination.images || destination.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % destination.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [destination.images]);

  return (
    <div className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {destination.images && destination.images.length > 0 && (
        <img 
          src={destination.images[currentImageIndex].url} 
          alt={destination.city} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
        />
      )}
      <div className="hero-badge">{destination.match_percentage}% Match</div>
      <h1 className="destination-title">{destination.city}</h1>
      {destination.primary_vibe && (
        <p className="hero-vibe">{destination.primary_vibe}</p>
      )}
    </div>
  );
}

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
        <DetailHero destination={destination} />

        {/* Main Grid */}
        <div className="detail-grid">
          {/* Left Column */}
          <div className="detail-column left">
            {/* Why This Destination Card */}
            <section className="detail-section highlight-section">
              <h2>Why You'll Love It</h2>
              <p className="reason-text">
                {destination.reason || 'This destination perfectly matches your travel preferences based on your uploaded images and style choices.'}
              </p>
            </section>

            {/* Travel Details */}
            <div className="info-cards-row">
              {destination.suggested_season && (
                <div className="info-card">
                  <div>
                    <span className="info-label">Best Time to Visit</span>
                    <span className="info-value">{destination.suggested_season}</span>
                  </div>
                </div>
              )}
              <div className="info-card">
                <div>
                  <span className="info-label">Match Score</span>
                  <span className="info-value">{destination.match_percentage}% Match</span>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            {destination.extracted_tags && destination.extracted_tags.length > 0 && (
              <section className="detail-section">
                <h2>Key Characteristics</h2>
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
            <div className="cta-card glass-panel">
              <h3>Ready to Plan Your Trip?</h3>
              <p>Save this destination to your wishlist or find flights now</p>

              <div className="action-buttons">
                <button
                  className={`btn-action ${isInWishlist ? 'active' : ''}`}
                  onClick={() => onAddToWishlist(destination)}
                  disabled={isInWishlist}
                >
                  {isInWishlist ? '✓ Saved to Wishlist' : 'Add to Wishlist'}
                </button>

                <button
                  className="btn-action primary"
                  onClick={() => onFindFlights(destination)}
                >
                  Find Flights
                </button>
              </div>

              <div className="info-box">
                <h4>Next Steps</h4>
                <p>Click "Find Flights" to search for the best deals from your location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
