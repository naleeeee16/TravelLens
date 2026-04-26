import { useState, useEffect } from 'react'
import './App.css'
import InputMode from './components/InputMode'
import ResultsList from './components/ResultsList'
import DestinationDetail from './components/DestinationDetail'
import Wishlist from './components/Wishlist'
import Flights from './components/Flights'

// Mock data for testing removed

function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('travelens_view') || 'input')
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('travelens_destinations')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedDestination, setSelectedDestination] = useState(() => {
    const saved = localStorage.getItem('travelens_selected')
    return saved ? JSON.parse(saved) : null
  })
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('travelens_wishlist')
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)
  const [commonTheme, setCommonTheme] = useState(() => localStorage.getItem('travelens_theme') || '')
  const [previousView, setPreviousView] = useState(() => localStorage.getItem('travelens_prev_view') || 'wishlist')
  
  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('travelens_view', currentView)
    localStorage.setItem('travelens_destinations', JSON.stringify(destinations))
    localStorage.setItem('travelens_selected', JSON.stringify(selectedDestination))
    localStorage.setItem('travelens_wishlist', JSON.stringify(wishlist))
    localStorage.setItem('travelens_theme', commonTheme)
    localStorage.setItem('travelens_prev_view', previousView)
  }, [currentView, destinations, selectedDestination, wishlist, commonTheme, previousView])
  
  const handleInputSubmit = async (inputData) => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData)
      })
      
      const data = await response.json()
      if (response.ok) {
        setDestinations(data.top_destinations || [])
        setCommonTheme(data.common_theme || '')
        setCurrentView('results')
      } else {
        alert(data.error || 'An error occurred during discovery.')
      }
    } catch (error) {
      console.error('API Error:', error)
      alert('Failed to connect to the backend server. Make sure it is running.')
    } finally {
      setLoading(false)
    }
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
    setSelectedDestination(destination)
    setPreviousView(currentView)
    setCurrentView('flights')
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"></span>
            <h1>TraveLens</h1>
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

        {currentView === 'flights' && selectedDestination && (
          <Flights 
            destination={selectedDestination}
            onBack={() => setCurrentView(previousView)}
          />
        )}
      </main>

      <footer className="footer">
        <p><span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>TraveLens</span> © 2026 | Discover your next adventure powered by SkyScanner</p>
      </footer>
    </div>
  )
}

export default App
