import os
import requests
from dotenv import load_dotenv

load_dotenv()

class UnsplashScouter:
    def __init__(self):
        self.access_key = os.getenv("UNSPLASH_ACCESS_KEY")
        self.base_url = "https://api.unsplash.com/search/photos"

    def get_destination_images(self, location, count=6):
        """
        Prima lokaciju (npr. 'Paris, France') i vraća listu URL-ova slika.
        """
        if not self.access_key:
            print("[!] Error: Unsplash Access Key missing in .env")
            return []

        # Optimizujemo pretragu dodavanjem ključnih reči za bolju estetiku
        search_query = f"{location} travel architecture"
        
        params = {
            "query": search_query,
            "per_page": count,
            "orientation": "landscape", # Možeš menjati u 'portrait' za mobilni
            "client_id": self.access_key
        }

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()

            image_urls = []
            for photo in data.get("results", []):
                # 'regular' je najbolji balans kvaliteta i brzine učitavanja
                image_urls.append({
                    "url": photo["urls"]["regular"],
                    "description": photo.get("alt_description"),
                    "photographer": photo["user"]["name"],
                    "link": photo["links"]["html"] # Unsplash zahteva da linkuješ ka autoru
                })
            
            print(f"[✓] Successfully fetched {len(image_urls)} images for {location}")
            return image_urls

        except Exception as e:
            print(f"[✗] Unsplash Error: {e}")
            return []

# Testiranje (ako pokreneš direktno ovaj fajl)
if __name__ == "__main__":
    scouter = UnsplashScouter()
    test_location = "Santorini, Greece"
    images = scouter.get_destination_images(test_location)
    
    for idx, img in enumerate(images, 1):
        print(f"{idx}. {img['url']} (by {img['photographer']})")