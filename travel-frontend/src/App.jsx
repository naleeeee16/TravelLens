import { useState } from 'react'
import './App.css'
import InputMode from './components/InputMode'
import ResultsList from './components/ResultsList'
import DestinationDetail from './components/DestinationDetail'
import Wishlist from './components/Wishlist'

function App() {
  const [currentView, setCurrentView] = useState('input')
  const [destinations, setDestinations] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [commonTheme, setCommonTheme] = useState('')

  const handleInputSubmit = async (inputData) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/travel-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      })
      const data = await response.json()
      setDestinations(data.top_destinations || [])
      setCommonTheme(data.common_theme || '')
      setCurrentView('results')
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      alert('Error getting recommendations. Check your backend is running.')
    }
    setLoading(false)
  }

  const handleSelectDestination = (destination) => {
    setSelectedDestination(destination)
    setCurrentView('detail')
  }

  const handleAddToWishlist = (destination) => {
    if (!wishlist.find(item => item.city === destination.city)) {
      setWishlist([...wishlist, destination])
    }
  }

  const handleRemoveFromWishlist = (city) => {
    setWishlist(wishlist.filter(item => item.city !== city))
  }

  const handleFindFlights = (destination) => {
    window.open(`https://www.skyscanner.com/transport/flights-from/${destination.city}`, '_blank')
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✈️</span>
            <h1>TravelLens</h1>
          </div>
          <nav className="nav-buttons">
            <button 
              className={`nav-btn ${currentView === 'input' ? 'active' : ''}`}
              onClick={() => setCurrentView('input')}
            >
              Discover
            </button>
            <button 
              className={`nav-btn ${currentView === 'wishlist' ? 'active' : ''}`}
              onClick={() => setCurrentView('wishlist')}
            >
              Wishlist ({wishlist.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'input' && (
          <InputMode onSubmit={handleInputSubmit} isLoading={loading} />
        )}

        {currentView === 'results' && (
          <ResultsList 
            destinations={destinations}
            commonTheme={commonTheme}
            onSelectDestination={handleSelectDestination}
            onBack={() => setCurrentView('input')}
            loading={loading}
          />
        )}

        {currentView === 'detail' && selectedDestination && (
          <DestinationDetail
            destination={selectedDestination}
            onBack={() => setCurrentView('results')}
            onAddToWishlist={handleAddToWishlist}
            onFindFlights={handleFindFlights}
            isInWishlist={wishlist.some(item => item.city === selectedDestination.city)}
          />
        )}

        {currentView === 'wishlist' && (
          <Wishlist 
            items={wishlist}
            onRemove={handleRemoveFromWishlist}
            onFindFlights={handleFindFlights}
            onViewDetail={(destination) => {
              setSelectedDestination(destination)
              setCurrentView('detail')
            }}
          />
        )}
      </main>

      <footer className="footer">
        <p>TravelLens © 2024 | Discover your next adventure powered by AI</p>
      </footer>
    </div>
  )
}

export default App
