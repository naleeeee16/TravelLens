# TravelLens

**TravelLens** is an innovative travel discovery application built during HackUPC Barcelona, sponsored by SkyScanner. The app leverages artificial intelligence to transform users' visual inspirations into personalized travel recommendations, making destination discovery more intuitive and exciting than ever before.

Users can upload images or provide Pinterest board URLs featuring their dream destinations. Our AI analyzes these visuals using OpenAI's GPT-4o Vision API to identify common themes and suggest matching travel destinations from SkyScanner's extensive database. Whether you're inspired by tropical beaches, mountain landscapes, or urban adventures, TravelLens finds the perfect destinations that match your aesthetic preferences.

### 🚀 Key Features

- **Visual Discovery**: Upload photos or Pinterest boards for AI-powered destination matching
- **Personalized Recommendations**: Get curated travel suggestions based on your visual preferences
- **Wishlist Management**: Save and organize favorite destinations with secure user authentication
- **Flight Integration**: Direct links to SkyScanner for booking flights to recommended destinations
- **Modern UI**: Clean, responsive interface with smooth animations and pastel aesthetic
- **Real-time Analysis**: Instant AI processing of images for immediate recommendations

Developed over 36 hours at HackUPC Barcelona, TravelLens demonstrates how visual inspiration can be transformed into actionable travel plans through intelligent technology. The project showcases innovative integration with SkyScanner's services and creative use of AI in the travel industry.

## Installation

```bash
pip install -r requirements.txt
```

## Run the server
### Backend
```bash
uvicorn app:app --reload
```
### Frontend
```bash
cd ./travel-frontend
npm install
npm run dev
```


