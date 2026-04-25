import { useState } from 'react'
import './App.css'
import InputMode from './components/InputMode'
import ResultsList from './components/ResultsList'
import DestinationDetail from './components/DestinationDetail'
import Wishlist from './components/Wishlist'
import Flights from './components/Flights'
import Reservations from './components/Reservations'

// Mock data for testing removed

function App() {
  const [currentView, setCurrentView] = useState('input')
  const [destinations, setDestinations] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [commonTheme, setCommonTheme] = useState('')
  const [reservations, setReservations] = useState([])
  
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
    setCurrentView('flights')
  }

  const handleSaveReservation = (flight) => {
    if (!reservations.find(res => res.booking_link === flight.booking_link)) {
      setReservations([...reservations, flight])
      alert('Flight saved to reservations!')
    }
  }

  const handleRemoveReservation = (link) => {
    setReservations(reservations.filter(res => res.booking_link !== link))
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"></span>
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
            <button 
              className={`nav-btn ${currentView === 'reservations' ? 'active' : ''}`}
              onClick={() => setCurrentView('reservations')}
            >
              Reservations ({reservations.length})
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
            onBack={() => setCurrentView('wishlist')}
            onSaveReservation={handleSaveReservation}
          />
        )}

        {currentView === 'reservations' && (
          <Reservations 
            items={reservations}
            onRemove={handleRemoveReservation}
          />
        )}
      </main>

      <footer className="footer">
        <p>TravelLens © 2026 | Discover your next adventure powered by SkyScanner</p>
      </footer>
    </div>
  )
}

export default App
