import os
import base64
import json
from fastapi import FastAPI
import google.generativeai as genai

from skyscanner import get_flights_for_destinations

app = FastAPI()

# 🔑 GEMINI API KEY
genai.configure(api_key="AIzaSyDoOnwTAb__mYOb7HxIRUCiG0rrfrc1E78")

# Model verzija (2.5 ne postoji još uvek, 1.5-flash je aktuelna stabilna)
model = genai.GenerativeModel("gemini-2.5-flash")

IMAGE_PATHS = [
    "images/beach.jpeg",
    "images/castle.jpg"
]

# -----------------------------
# 1. IMAGE -> JSON FEATURES
# -----------------------------
def extract_features(image_path: str):
    with open(image_path, "rb") as f:
        img_bytes = f.read()
    image_base64 = base64.b64encode(img_bytes).decode("utf-8")

    prompt = """
    Act as an expert travel discovery agent. Analyze this image.
    Extract features, identify landmarks and suggest vibe.
    
    Return the response ONLY as a JSON object with this exact structure:
    {
      "extracted_tags": ["tag1", "tag2"],
      "landmark_found": "Name or None",
      "primary_vibe": "Description of the travel style"
    }
    """

    response = model.generate_content(
        [prompt, {"mime_type": "image/jpeg", "data": image_base64}],
        generation_config={"response_mime_type": "application/json"}
    )
    
    return json.loads(response.text)

# -----------------------------
# 2. JSON FEATURES -> JSON DESTINATIONS
# -----------------------------
def get_destinations(all_features_json):
    context = json.dumps(all_features_json, indent=2)

    prompt = f"""
    You are a travel expert. Based on these extracted features from multiple images:
    {context}

    Find the intersection of these vibes and suggest 5 destinations.
    Return ONLY a JSON object with this structure:
    {{
      "common_theme": "Description of the shared aesthetic",
      "top_destinations": [
        {{
          "city": "City, Country",
          "reason": "Why it matches both architecture and nature tags",
          "match_percentage": 95
        }}
      ]
    }}
    """

    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    return json.loads(response.text)

# -----------------------------
# 3. MAIN ENDPOINT
# -----------------------------
@app.get("/travel-board")
def travel_board():
    all_features = []

    print("\n" + "="*50)
    print("KORAK 1: ANALIZA POJEDINAČNIH SLIKA")
    print("="*50)

    for img in IMAGE_PATHS:
        try:
            feature_data = extract_features(img)
            all_features.append(feature_data)
            
            # ISPIS U TERMINALU ZA SVAKU SLIKU
            print(f"\n🖼️ Slika: {img}")
            print(json.dumps(feature_data, indent=4, ensure_ascii=False))
            
        except Exception as e:
            print(f"❌ Greška kod {img}: {e}")

    print("\n" + "="*50)
    print("KORAK 2: KONAČNE PREPORUKE (VIBE MERGE)")
    print("="*50)
    
    if not all_features:
        return {"error": "Nijedna slika nije obrađena."}

    try:
        final_recommendations = get_destinations(all_features)
        
        # ISPIS FINALNOG REZULTATA U TERMINALU
        print("\n🌍 PREDLOŽENE DESTINACIJE:")
        print(json.dumps(final_recommendations, indent=4, ensure_ascii=False))
        print("\n" + "="*50)

        # 2. Izvuci samo imena gradova iz JSON-a koji je vratio Gemini
        cities = [d['city'] for d in final_recommendations['top_destinations']]
        
        # 3. Pozovi Skyscanner funkciju
        flights = get_flights_for_destinations(cities)
        return {
            "vibe_analysis": final_recommendations,
            "flight_offers": flights
        }
    except Exception as e:
        print(f"❌ Greška u generisanju preporuka: {e}")
        return {"error": str(e)}
