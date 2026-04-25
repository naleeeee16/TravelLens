import { useState } from 'react'
import './InputMode.css'

export default function InputMode({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'pinterest'
  const [uploadedImages, setUploadedImages] = useState([])
  const [pinterestUrl, setPinterestUrl] = useState('')
  const [error, setError] = useState('')

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setUploadedImages([...uploadedImages, ...newImages])
    setError('')
  }

  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id))
  }

  const handlePinterestSubmit = () => {
    if (!pinterestUrl.trim()) {
      setError('Please enter a Pinterest board URL')
      return
    }
    if (!pinterestUrl.includes('pinterest.com')) {
      setError('Please enter a valid Pinterest URL')
      return
    }
    onSubmit({ source: 'pinterest', url: pinterestUrl })
  }

  const handleImageSubmit = () => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image')
      return
    }
    onSubmit({ source: 'images', images: uploadedImages })
  }

  return (
    <div className="input-mode-container">
      <div className="input-header">
        <h2>How would you like to find your next destination?</h2>
        <p>Choose between uploading images or using a Pinterest board</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => { setActiveTab('upload'); setError(''); }}
        >
          📸 Upload Images
        </button>
        <button
          className={`tab-button ${activeTab === 'pinterest' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pinterest'); setError(''); }}
        >
          📌 Pinterest Board
        </button>
      </div>

      {/* Upload Images Tab */}
      {activeTab === 'upload' && (
        <div className="tab-content upload-tab">
          <div className="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              id="file-input"
              onChange={handleImageUpload}
              disabled={isLoading}
            />
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-icon">🖼️</div>
              <h3>Drop images here or click to browse</h3>
              <p>Upload photos of destinations, architecture, or vibes you like</p>
              <p className="upload-hint">JPG, PNG up to 5MB each</p>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="image-preview-grid">
              <h3>{uploadedImages.length} image(s) selected</h3>
              <div className="grid">
                {uploadedImages.map(img => (
                  <div key={img.id} className="image-preview-card">
                    <img src={img.preview} alt={img.name} />
                    <button
                      className="remove-btn"
                      onClick={() => removeImage(img.id)}
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                    <p className="image-name">{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            className="btn-primary submit-btn"
            onClick={handleImageSubmit}
            disabled={uploadedImages.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading"></span>
                Analyzing...
              </>
            ) : (
              <>🚀 Find Destinations</>
            )}
          </button>
        </div>
      )}

      {/* Pinterest URL Tab */}
      {activeTab === 'pinterest' && (
        <div className="tab-content pinterest-tab">
          <div className="pinterest-input-section">
            <div className="input-group">
              <label htmlFor="pinterest-url">Pinterest Board URL</label>
              <div className="url-input-wrapper">
                <span className="url-icon">📌</span>
                <input
                  type="text"
                  id="pinterest-url"
                  placeholder="https://www.pinterest.com/username/board-name/"
                  value={pinterestUrl}
                  onChange={(e) => {
                    setPinterestUrl(e.target.value)
                    setError('')
                  }}
                  disabled={isLoading}
                />
              </div>
              <p className="input-hint">
                Enter a public Pinterest board URL. Make sure it's accessible without login.
              </p>
            </div>

            <div className="pinterest-info">
              <h4>📌 How to find your board URL:</h4>
              <ol>
                <li>Go to your board on Pinterest</li>
                <li>Click the board name or settings</li>
                <li>Copy the URL from the address bar</li>
                <li>Paste it above</li>
              </ol>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              className="btn-primary submit-btn"
              onClick={handlePinterestSubmit}
              disabled={!pinterestUrl.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading"></span>
                  Fetching Board...
                </>
              ) : (
                <>🚀 Analyze Board</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
