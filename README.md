# TravelLens

TravelLens is an AI-powered travel discovery application that analyzes images using Google Gemini AI to extract features and recommend destinations based on shared themes.

## Installation

```bash
pip install -r requirements.txt
```

## Run the server

uvicorn agent:app --reload

## API endpoint

GET /travel-board

Analyzes the images in the images/ folder and returns destination recommendations.