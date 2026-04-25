import { useState } from 'react'
import './ResultsList.css'

export default function ResultsList({
  destinations,
  commonTheme,
  onSelectDestination,
  onBack,
  loading
}) {
  const [sortBy, setSortBy] = useState('match') // 'match' or 'alphabetical'

  const sortedDestinations = [...destinations].sort((a, b) => {
    if (sortBy === 'match') {
      return (b.match_percentage || 0) - (a.match_percentage || 0)
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
          <h2>🎯 Your Personalized Destinations</h2>
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
            <option value="match">Match Percentage ↓</option>
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
          <div
            key={index}
            className="destination-card"
            onClick={() => onSelectDestination(destination)}
          >
            {/* Match Badge */}
            <div className="match-badge">
              <div className="match-percentage">
                {destination.match_percentage || 85}%
              </div>
              <div className="match-label">Match</div>
            </div>

            {/* Card Content */}
            <div className="card-content">
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
                  ✨ {destination.primary_vibe}
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
