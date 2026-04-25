# TravelLens Frontend - Modern Travel Recommendation UI

## 🎨 Technology Stack

This frontend is built with modern, cutting-edge technologies chosen for their performance, developer experience, and stunning UI capabilities:

### **Core Framework**
- **React 19.2.5** - Latest React version with optimized rendering and improved hooks
- **Vite 8.0.10** - Ultra-fast build tool with instant HMR (Hot Module Replacement)
- **JavaScript (ES6+)** - Modern JavaScript with full module support

### **Styling & Design**
- **CSS3 with Custom Properties (CSS Variables)** - Fully customizable design system
- **Flexbox & CSS Grid** - Responsive layouts without dependencies
- **Smooth Animations** - Hardware-accelerated transitions using `transform` and `opacity`
- **Modern Color Gradients** - Linear and radial gradients for depth
- **Responsive Design** - Mobile-first approach with media queries

### **UI Features**
- **Clean, Minimalist Design** - Modern aesthetic with ample whitespace
- **Smooth Animations & Transitions** - 0.3s ease transitions throughout
- **Glassmorphism Effects** - Subtle transparency and blur effects
- **Interactive Components** - Hover states, active states, disabled states
- **Loading States** - Spinning animations and visual feedback
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

### **HTTP Client**
- **Axios 1.6.2** - Promise-based HTTP client for API calls

### **Icons & Emojis**
- Uses native emoji for intuitive, universal icons
- Lucide React (optional) - For additional vector icons if needed

---

## 📁 Project Structure

```
travel-frontend/
├── src/
│   ├── components/
│   │   ├── InputMode.jsx          # Image upload & Pinterest board input
│   │   ├── InputMode.css          # Input mode styling
│   │   ├── ResultsList.jsx        # Destination recommendations grid
│   │   ├── ResultsList.css        # Results list styling
│   │   ├── DestinationDetail.jsx  # Detailed view with full info
│   │   ├── DestinationDetail.css  # Detail view styling
│   │   ├── Wishlist.jsx           # Saved destinations list & table
│   │   └── Wishlist.css           # Wishlist styling
│   ├── App.jsx                    # Main app component with routing
│   ├── App.css                    # Global styles & design system
│   ├── main.jsx                   # React DOM mount point
│   ├── index.css                  # Root styles
│   └── assets/                    # Images and static files
├── public/                        # Static assets
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies & scripts
├── README.md                      # This file
└── eslint.config.js              # ESLint configuration

```

---

## 🎯 Features & User Experience

### **1. Input Mode**
- **Two Input Methods:**
  - 📸 **Upload Images** - Drag & drop or click to upload travel inspiration photos
  - 📌 **Pinterest Board** - Paste a public Pinterest board URL
- **Image Preview** - Shows thumbnail previews of uploaded images with removal option
- **Error Handling** - Validation and user-friendly error messages
- **Loading State** - Visual feedback while processing

### **2. Results View**
- **Destination Grid** - Modern card layout with hover animations
- **Match Score Badge** - Green badge showing AI match percentage (top-right of card)
- **Sorting Options** - Sort by match percentage or alphabetically
- **Travel Theme Display** - Shows the common theme identified by AI
- **Quick Insights** - Vibe, tags, and reason visible on card
- **Smooth Animations** - Cards lift up on hover with enhanced shadows

### **3. Destination Detail**
- **Hero Section** - Large, gradient background with destination name
- **Match Indicator** - Animated progress bar showing match percentage
- **Why You'll Love It** - Detailed explanation from AI
- **Travel Vibe** - Description of the destination's character
- **Key Characteristics** - Tags and features extracted from images
- **Call-to-Action**
  - ♡ Add to Wishlist button
  - ✈️ Find Flights button (opens Skyscanner)
- **Stats** - Match score and AI confidence
- **Responsive Layout** - 2-column desktop, 1-column mobile

### **4. Wishlist**
- **Summary Statistics** - Total destinations, average match score
- **Table View** - Professional table with sorting capabilities
- **Quick Actions**
  - 👁️ View detailed info
  - ✈️ Find flights
  - ✕ Remove from wishlist
- **Empty State** - Friendly message when no items saved
- **Batch Actions** - Export wishlist, book all flights

---

## 🎨 Design System

### **Color Palette**
```css
--primary: #3b82f6          /* Vibrant Blue */
--primary-dark: #1e40af      /* Dark Blue */
--secondary: #8b5cf6         /* Purple */
--success: #10b981           /* Green */
--danger: #ef4444            /* Red */
--warning: #f59e0b           /* Amber */
--bg-light: #f8fafc          /* Light Gray Background */
--bg-card: #ffffff           /* White */
--border: #e2e8f0            /* Light Gray Border */
--text-primary: #1e293b      /* Dark Text */
--text-secondary: #64748b    /* Medium Gray Text */
```

### **Typography**
- **System Font Stack** - Uses device's native fonts for optimal performance
- **Font Sizes** - Responsive scaling from mobile to desktop
- **Font Weights** - 500 (medium), 600 (semibold), 700 (bold), 800 (extra-bold)

### **Spacing**
- **Base Unit** - 0.5rem (8px)
- **Common Spacings** - 0.5rem, 1rem, 1.5rem, 2rem, 3rem
- **Grid Gap** - 1rem to 2rem depending on context

### **Border Radius**
- **Small** - 6px (buttons, tags)
- **Medium** - 8px (inputs, cards)
- **Large** - 12px (sections, hero)
- **Pill** - 20px (badges)

### **Shadows**
- **Light** - `0 2px 8px rgba(0, 0, 0, 0.05)`
- **Medium** - `0 4px 16px rgba(0, 0, 0, 0.1)`
- **Heavy** - `0 12px 24px rgba(59, 130, 246, 0.15)`

---

## 🚀 Getting Started

### **Installation**

```bash
# Navigate to the frontend directory
cd travel-frontend

# Install dependencies
npm install
```

### **Development Server**

```bash
# Start development server with HMR
npm run dev

# Server will run at http://localhost:5173
```

### **Building for Production**

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

### **Linting**

```bash
# Run ESLint
npm run lint
```

---

## 🔗 API Integration

The frontend connects to the backend at `http://localhost:8000` by default. Update the API endpoint in `App.jsx` if your backend runs on a different port:

```javascript
const response = await fetch('http://localhost:8000/travel-board', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(inputData),
})
```

### **Expected API Response Format:**

```json
{
  "common_theme": "Architectural heritage with modern urban vibes",
  "top_destinations": [
    {
      "city": "Barcelona, Spain",
      "reason": "Perfect blend of gothic architecture and contemporary culture",
      "match_percentage": 95,
      "primary_vibe": "Historic yet vibrant, architectural explorer's paradise",
      "extracted_tags": ["architecture", "beaches", "culture"]
    }
  ]
}
```

---

## 📱 Responsive Design

The UI is fully responsive with breakpoints at:
- **Desktop** - 1024px and above (2-column layouts)
- **Tablet** - 768px to 1024px (adjusted spacing)
- **Mobile** - Below 768px (single column, stacked layouts)

Key responsive changes:
- Header becomes flex-column on mobile
- Grid layouts stack to single column
- Font sizes scale down
- Touch-friendly button sizing

---

## ✨ Animation & Interactions

All interactive elements feature smooth transitions:
- **0.3s ease** - Standard transition timing
- **Hardware acceleration** - Uses `transform` for smooth 60fps animations
- **Hover effects** - Cards lift, buttons scale, shadows enhance
- **Loading states** - Rotating spinner with text feedback
- **Page transitions** - Fade in animations for view changes

---

## 🔧 Customization

### **Changing Colors**
Edit CSS variables in `App.css`:
```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... etc */
}
```

### **Adding New Components**
1. Create `ComponentName.jsx` in `src/components/`
2. Create `ComponentName.css` for styles
3. Import and use in `App.jsx`

### **Modifying Layouts**
All CSS is modular per component - edit the corresponding `.css` file to change styling.

---

## 📦 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.5 | UI framework |
| react-dom | 19.2.5 | DOM rendering |
| axios | 1.6.2 | HTTP client |
| lucide-react | 0.376.0 | Optional icon library |
| vite | 8.0.10 | Build tool |
| @vitejs/plugin-react | 6.0.1 | Vite React plugin |
| eslint | 10.2.1 | Code linting |

---

## 🎭 Component Prop Types

### **InputMode**
```javascript
{
  onSubmit: (data) => void,  // Called with {source, images/url}
  isLoading: boolean         // Shows loading state
}
```

### **ResultsList**
```javascript
{
  destinations: array,       // Array of destination objects
  commonTheme: string,       // Theme description
  onSelectDestination: fn,   // Called when destination clicked
  onBack: fn,               // Back button handler
  loading: boolean          // Loading indicator
}
```

### **DestinationDetail**
```javascript
{
  destination: object,       // Selected destination data
  onBack: fn,               // Back button handler
  onAddToWishlist: fn,      // Add to wishlist handler
  onFindFlights: fn,        // Find flights handler
  isInWishlist: boolean     // Wishlist status
}
```

### **Wishlist**
```javascript
{
  items: array,             // Wishlist destination array
  onRemove: fn,             // Remove item handler
  onFindFlights: fn,        // Find flights handler
  onViewDetail: fn          // View detail handler
}
```

---

## 🌟 Key UX Principles

1. **Clarity** - Clear typography hierarchy and visual hierarchy
2. **Feedback** - Every action provides immediate visual feedback
3. **Minimalism** - Clean design with ample whitespace
4. **Consistency** - Unified color palette and spacing throughout
5. **Smoothness** - Smooth animations for professional feel
6. **Responsiveness** - Works seamlessly on all devices
7. **Accessibility** - Semantic HTML and keyboard navigation

---

## 🐛 Troubleshooting

### **API Connection Error**
- Check backend is running on `http://localhost:8000`
- Verify CORS is enabled in FastAPI backend

### **Images Not Loading**
- Check file sizes are under 5MB
- Ensure supported formats (JPG, PNG)

### **Layout Issues**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (`npm run dev`)

---

## 📄 License

This project is part of the TravelLens hackathon submission.

---

## 🤝 Backend Integration Notes

The frontend expects the FastAPI backend (`agent.py`) to provide:
1. Image analysis via Gemini AI
2. Destination recommendations
3. Match percentage scoring
4. Travel vibe classification

Ensure your backend is running before starting the frontend development server.

---

## 💡 Future Enhancements

- [ ] Image carousel on detail view
- [ ] Google Maps integration
- [ ] Weather information for destinations
- [ ] User authentication & persistent wishlist
- [ ] Social sharing features
- [ ] Comparison view for multiple destinations
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Progressive Web App (PWA) support

---

**Built with ❤️ for travel enthusiasts**
