# TravelLens - Quick Start Guide

## 🚀 Installation & Setup

### **Step 1: Install Dependencies**
```bash
cd travel-frontend
npm install
```

### **Step 2: Start the Backend**
```bash
# In the root TravelLens directory
python agent.py
# or
uvicorn agent:app --reload
```
Backend will run at: `http://localhost:8000`

### **Step 3: Start the Frontend**
```bash
# In the travel-frontend directory
npm run dev
```
Frontend will run at: `http://localhost:5173`

### **Step 4: Open in Browser**
Visit: `http://localhost:5173`

---

## 🎯 Using the App

### **1. Discover Mode**
**Option A: Upload Images**
- Click "📸 Upload Images" tab
- Drag & drop or click to select travel inspiration photos
- Click "🚀 Find Destinations"

**Option B: Pinterest Board**
- Click "📌 Pinterest Board" tab
- Paste a public Pinterest board URL
- Click "🚀 Analyze Board"

### **2. View Results**
- Browse recommended destinations sorted by match score
- Each card shows:
  - ✨ Match percentage
  - 🎨 Travel vibe
  - 🏷️ Key characteristics
  - 📝 Quick description

### **3. Explore Destination Details**
- Click any destination card to see full details
- View why it matches your preferences
- See extracted tags and characteristics
- Find flights via Skyscanner

### **4. Save to Wishlist**
- Click "♡ Add to Wishlist" on any destination
- View all saved destinations in the Wishlist tab
- See statistics and quick actions

### **5. Find Flights**
- Click "✈️ Find Flights" to open Skyscanner
- Book your trip!

---

## 🎨 Features Overview

| Feature | Description |
|---------|-------------|
| 📸 Image Upload | Upload multiple travel inspiration photos |
| 📌 Pinterest Integration | Analyze public Pinterest board pins |
| 🤖 AI Analysis | Gemini AI extracts vibes and themes |
| 🎯 Smart Matching | Matches destinations to your preferences |
| 💚 Wishlist | Save favorite destinations |
| 📊 Sorting | Sort by match % or alphabetically |
| ✈️ Flight Search | Integrated Skyscanner search |
| 📱 Responsive | Works on all devices |
| 🎨 Modern UI | Clean, intuitive interface |

---

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── InputMode       # Image/Pinterest input
│   ├── ResultsList     # Destination grid
│   ├── DestinationDetail  # Single destination view
│   └── Wishlist        # Saved destinations
├── App.jsx            # Main app component
├── App.css            # Global styles
└── index.css          # Root styles
```

---

## 🎨 Design System

- **Colors**: Modern blue (#3b82f6) and purple (#8b5cf6)
- **Spacing**: Consistent rem-based spacing
- **Animations**: Smooth 0.3s transitions
- **Responsive**: Mobile-first design
- **Typography**: System font stack for performance

---

## 🔗 API Integration

Backend expected to return:
```json
{
  "common_theme": "string",
  "top_destinations": [
    {
      "city": "string",
      "reason": "string",
      "match_percentage": number,
      "primary_vibe": "string",
      "extracted_tags": ["tag1", "tag2"]
    }
  ]
}
```

---

## ❓ Troubleshooting

### **Port Already in Use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

### **CORS Error**
- Ensure backend has CORS enabled
- Check frontend API URL: `http://localhost:8000`

### **Images Not Showing**
- Verify file formats (JPG, PNG)
- Check file sizes < 5MB
- Try incognito mode (clear cache)

### **Slow Performance**
```bash
npm run build   # Create optimized build
npm run preview # Test production version
```

---

## 📝 Notes

- ✅ Frontend ready for deployment
- ✅ All components styled and responsive
- ✅ Smooth animations and transitions
- ✅ Error handling implemented
- ✅ Loading states included
- ✅ Mobile optimized

---

## 📞 Support

For issues or questions, check:
1. Backend logs in terminal
2. Browser console (F12)
3. Network tab (API calls)

---

**Happy travels! 🌍✈️**
