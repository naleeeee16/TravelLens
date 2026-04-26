import { useState, useEffect } from 'react'
import './ResultsList.css'

function DestinationCard({ destination, onSelect }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = destination.images ? destination.images.slice(0, 2) : [];

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="destination-card" onClick={() => onSelect(destination)}>
      {/* Destination Image */}
      {images.length > 0 && (
        <div className="card-carousel">
          <img 
            src={images[currentImageIndex].url} 
            alt={destination.city} 
            className="carousel-image"
          />
          {destination.match_percentage && (
            <div className="match-badge">
              <span className="match-percentage">{destination.match_percentage}%</span>
              <span className="match-label">Match</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="carousel-controls">
              <button className="carousel-btn prev" onClick={handlePrevImage}>‹</button>
              <button className="carousel-btn next" onClick={handleNextImage}>›</button>
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="card-content">
        {!destination.images && destination.match_percentage && (
          <div className="match-badge">
            <span className="match-percentage">{destination.match_percentage}%</span>
            <span className="match-label">Match</span>
          </div>
        )}
        <h3 className="destination-name">
          {destination.city}
        </h3>

        {destination.reason && (
          <p className="destination-reason">
            {destination.reason.length > 100
              ? destination.reason.substring(0, 100) + '...'
              : destination.reason}
          </p>
        )}

        {destination.primary_vibe && (
          <p className="destination-vibe">
            {destination.primary_vibe}
          </p>
        )}

        {destination.extracted_tags && (
          <div className="tags">
            {destination.extracted_tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="card-arrow">→</div>
    </div>
  );
}

export default function ResultsList({
  destinations,
  commonTheme,
  onSelectDestination,
  onBack,
  loading
}) {
  const [sortBy, setSortBy] = useState('recommended') // 'recommended' or 'alphabetical'

  const sortedDestinations = [...destinations].sort((a, b) => {
    if (sortBy === 'recommended') {
      return 0
    }
    return a.city.localeCompare(b.city)
  })

  return (
    <div className="results-list-container">
      {/* Results Header */}
      <div className="results-header">
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <div className="header-content">
          <h2>Your Personalized Destinations</h2>
          {commonTheme && (
            <div className="theme-card">
              <p className="theme-label">Travel Theme</p>
              <p className="theme-text">{commonTheme}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="results-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="alphabetical">Alphabetical A-Z</option>
          </select>
        </div>
        <div className="results-count">
          {sortedDestinations.length} destinations found
        </div>
      </div>

      {/* Results Grid */}
      <div className="destinations-grid">
        {sortedDestinations.map((destination, index) => (
          <DestinationCard 
            key={index}
            destination={destination}
            onSelect={onSelectDestination}
          />
        ))}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <span className="loading"></span>
            <p>Analyzing your preferences...</p>
          </div>
        </div>
      )}
    </div>
  )
}
