import { useState } from 'react'
import './InputMode.css'

export default function InputMode({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'pinterest'
  const [uploadedImages, setUploadedImages] = useState([])
  const [pinterestUrl, setPinterestUrl] = useState('')
  const [desiredFeatures, setDesiredFeatures] = useState('')
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
    onSubmit({ source: 'pinterest', url: pinterestUrl, desired_features: desiredFeatures.trim() })
  }

  const handleImageSubmit = async () => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image')
      return
    }

    try {
      const base64Images = await Promise.all(
        uploadedImages.map(img => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img.file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
        })
      );
      onSubmit({ source: 'images', images: base64Images, desired_features: desiredFeatures.trim() })
    } catch (err) {
      setError('Error processing images')
    }
  }

  return (
    <div className="input-mode-container">
      <div className="input-header">
        <p style={{ fontSize: '1.275em', fontStyle: 'italic', marginBottom: '5px' }}>Turn your travel inspiration into real destinations.</p>
        <h2>How would you like to find your next destination?</h2>
      </div>



      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => { setActiveTab('upload'); setError(''); }}
        >
          <span className="tab-icon upload-icon-min" aria-hidden="true"></span>
          <span>Upload Images</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'pinterest' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pinterest'); setError(''); }}
        >
          <span className="tab-icon pinterest-logo-mini" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.19 2.58 7.78 6.23 9.27-.09-.79-.17-2.01.03-2.88.18-.78 1.17-4.98 1.17-4.98s-.3-.61-.3-1.51c0-1.41.82-2.47 1.84-2.47.87 0 1.29.65 1.29 1.43 0 .87-.55 2.17-.84 3.38-.24 1.02.52 1.84 1.53 1.84 1.84 0 3.08-2.37 3.08-5.18 0-2.14-1.44-3.74-4.06-3.74-2.96 0-4.8 2.2-4.8 4.66 0 .85.25 1.45.64 1.91.18.21.2.29.14.53-.05.17-.15.6-.2.77-.06.24-.25.33-.46.24-1.28-.52-1.88-1.92-1.88-3.5 0-2.6 2.2-5.72 6.56-5.72 3.5 0 5.8 2.53 5.8 5.25 0 3.59-1.99 6.27-4.92 6.27-.98 0-1.89-.53-2.2-1.12 0 0-.53 2.08-.64 2.5-.23.85-.67 1.7-1.08 2.36.96.28 1.97.43 3.02.43 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          </span>
          <span>Pinterest Board</span>
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
              <div className="upload-icon"></div>
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
                      ×
                    </button>
                    <p className="image-name">{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="trip-features-section" style={{ marginTop: '24px', marginBottom: '24px' }}>
            <label htmlFor="desired-features">
              What would you like on this trip?
              <span className="optional-badge">OPTIONAL</span>
            </label>
            <input
              id="desired-features"
              type="text"
              placeholder="Examples: beach + nightlife, cozy cafes, hiking trails, less crowds..."
              value={desiredFeatures}
              onChange={(e) => setDesiredFeatures(e.target.value)}
              disabled={isLoading}
            />
          </div>

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
              <>Find Destinations</>
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
                <span className="url-icon"></span>
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
              <h4>How to find your board URL:</h4>
              <ol>
                <li>Go to your board on Pinterest</li>
                <li>Click the board name or settings</li>
                <li>Copy the URL from the address bar</li>
                <li>Paste it above</li>
              </ol>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="trip-features-section" style={{ marginTop: '24px', marginBottom: '24px' }}>
              <label htmlFor="desired-features">
                What would you like on this trip?
                <span className="optional-badge">OPTIONAL</span>
              </label>
              <input
                id="desired-features"
                type="text"
                placeholder="Examples: beach + nightlife, cozy cafes, hiking trails, less crowds..."
                value={desiredFeatures}
                onChange={(e) => setDesiredFeatures(e.target.value)}
                disabled={isLoading}
              />
            </div>

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
                <>Analyze Board</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
