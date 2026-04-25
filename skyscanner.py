import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

class SkyscannerService:
    def __init__(self):
        self.api_key = os.getenv("SKYSCANNER_API_KEY")
        self.base_url = "https://partners.api.skyscanner.net/apiservices/v3"
        self.headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }

    def get_best_flights(self, dest_iata):
        url = f"{self.base_url}/flights/live/search/create"
        
        payload = {
            "query": {
                "market": "RS",
                "locale": "en-GB",
                "currency": "EUR",
                "queryLegs": [
                    {
                        "originPlaceId": {"iata": "BEG"},
                        "destinationPlaceId": {"iata": dest_iata},
                        "date": {"year": 2026, "month": 12, "day": 20}
                    }
                ],
                "adults": 1,
                "cabinClass": "CABIN_CLASS_ECONOMY"
            }
        }

        try:
            response = requests.post(url, headers=self.headers, json=payload)
            if response.status_code != 200:
                return {"error": f"API Error {response.status_code}"}

            data = response.json()
            
            # --- FILTRIRANJE PODATAKA ---
            itineraries = data.get('content', {}).get('results', {}).get('itineraries', {})
            legs = data.get('content', {}).get('results', {}).get('legs', {})
            
            extracted_flights = []

            for i_id, i_data in itineraries.items():
                # Uzimamo cenu (najjeftiniju opciju za taj let)
                price = i_data.get('pricingOptions', [{}])[0].get('price', {}).get('amount')
                raw_price = int(price) / 1000 if price else 0 # Skyscanner često šalje u hiljaditim delovima
                
                # Povezujemo sa 'leg' podacima (vreme, presedanja)
                leg_id = i_data.get('legIds', [None])[0]
                leg_data = legs.get(leg_id, {})
                
                departure = leg_data.get('departureDateTime', {})
                arrival = leg_data.get('arrivalDateTime', {})
                
                flight_info = {
                    "dest": dest_iata,
                    "price": f"{raw_price:.2f} EUR",
                    "departure": f"{departure.get('day')}/{departure.get('month')} {departure.get('hour')}:{departure.get('minute')}",
                    "arrival": f"{arrival.get('day')}/{arrival.get('month')} {arrival.get('hour')}:{arrival.get('minute')}",
                    "stops": leg_data.get('stopCount', 0),
                    "is_direct": leg_data.get('stopCount', 0) == 0,
                    "booking_link": i_data.get('pricingOptions', [{}])[0].get('items', [{}])[0].get('deepLink')
                }
                extracted_flights.append(flight_info)

            # Sortiramo po ceni i uzimamo top 10
            sorted_flights = sorted(extracted_flights, key=lambda x: float(x['price'].split()[0]))
            return sorted_flights[:10]

        except Exception as e:
            return {"error": str(e)}

def get_flights_for_destinations(cities):
    service = SkyscannerService()
    final_results = {}
    
    for city in cities:
        # Uzimamo IATA kod (prva 3 slova kao fallback)
        iata = city[:3].upper()
        print(f"🔎 Tražim top 10 letova za {iata}...")
        final_results[city] = service.get_best_flights(iata)
        
    return final_results

if __name__ == "__main__":
    # Testiraj sa listom gradova
    test_cities = ["PAR", "LON"]
    results = get_flights_for_destinations(test_cities)
    
    # Ispis samo bitnih podataka
    print("\n✈️ NAJBOLJE PONUDE LETOVA:")
    print("="*50)
    print(json.dumps(results, indent=4))