import { useState } from 'react'
import './App.css'
import InputMode from './components/InputMode'
import ResultsList from './components/ResultsList'
import DestinationDetail from './components/DestinationDetail'
import Wishlist from './components/Wishlist'

// Mock data for testing
const MOCK_RESPONSE = {
  common_theme: "Tropical beaches with crystal clear waters and lush rainforests",
  top_destinations: [
    {
      city: "Bali, Indonesia",
      reason: "Perfect blend of beautiful beaches, ancient temples, and vibrant culture. The island offers everything from surfing at Uluwatu to rice terrace walks in Ubud.",
      match_percentage: 94,
      primary_vibe: "Serene tropical paradise with spiritual depth",
      extracted_tags: ["beaches", "temples", "nature", "culture", "surfing"]
    },
    {
      city: "Maldives",
      reason: "World-renowned for pristine white sand beaches, overwater bungalows, and incredible marine life for snorkeling and diving.",
      match_percentage: 91,
      primary_vibe: "Luxury escape for relaxation and adventure",
      extracted_tags: ["luxury", "diving", "resorts", "marine-life", "privacy"]
    },
    {
      city: "Costa Rica",
      reason: "Eco-tourism paradise with rainforests, volcanoes, and both Pacific and Caribbean coastlines offering diverse beach experiences.",
      match_percentage: 88,
      primary_vibe: "Adventure meets natural beauty",
      extracted_tags: ["rainforest", "wildlife", "adventure", "ecotourism", "volcanoes"]
    },
    {
      city: "Phuket, Thailand",
      reason: "Thailand's largest island combines stunning beaches, vibrant nightlife, and rich Thai culture with excellent food scene.",
      match_percentage: 85,
      primary_vibe: "Vibrant beach culture with welcoming spirit",
      extracted_tags: ["beaches", "nightlife", "food", "culture", "islands"]
    },
    {
      city: "Santorini, Greece",
      reason: "Iconic white-washed buildings with blue domes, dramatic cliffs, and legendary sunsets over the Aegean Sea.",
      match_percentage: 82,
      primary_vibe: "Romantic Mediterranean escape",
      extracted_tags: ["romantic", "sunset", "architecture", "wine", "views"]
    }
  ]
}

function App() {
  const [currentView, setCurrentView] = useState('input')
  const [destinations, setDestinations] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [commonTheme, setCommonTheme] = useState('')

  const handleInputSubmit = async (inputData) => {
    setLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Use mock data instead of API call
    const data = MOCK_RESPONSE
    setDestinations(data.top_destinations || [])
    setCommonTheme(data.common_theme || '')
    setCurrentView('results')
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
        <p>TravelLens © 2026 | Discover your next adventure powered by SkyScanner</p>
      </footer>
    </div>
  )
}

export default App
