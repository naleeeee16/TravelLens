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

    def get_best_flights(self, dest_iata, origin_iata, date_str, date_end=None):
        import datetime
        url = f"{self.base_url}/flights/live/search/create"
        
        try:
            start_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
            if date_end:
                end_date = datetime.datetime.strptime(date_end, "%Y-%m-%d").date()
                if (end_date - start_date).days > 5:
                    return {"error": "Date range cannot exceed 5 days."}
                if (end_date - start_date).days < 0:
                    return {"error": "End date must be after start date."}
                dates = [start_date + datetime.timedelta(days=i) for i in range((end_date - start_date).days + 1)]
            else:
                dates = [start_date]
        except:
            return {"error": "Invalid date format"}
            
        all_flights = []
        
        for current_date in dates:
            year, month, day = current_date.year, current_date.month, current_date.day
            payload = {
                "query": {
                    "market": "RS",
                    "locale": "en-GB",
                    "currency": "EUR",
                    "queryLegs": [
                        {
                            "originPlaceId": {"iata": origin_iata},
                            "destinationPlaceId": {"iata": dest_iata},
                            "date": {"year": year, "month": month, "day": day}
                        }
                    ],
                    "adults": 1,
                    "cabinClass": "CABIN_CLASS_ECONOMY"
                }
            }
            
            try:
                response = requests.post(url, headers=self.headers, json=payload)
                if response.status_code != 200:
                    continue # Skip failed dates
                    
                data = response.json()
                itineraries = data.get('content', {}).get('results', {}).get('itineraries', {})
                legs = data.get('content', {}).get('results', {}).get('legs', {})
                
                for i_id, i_data in itineraries.items():
                    price = i_data.get('pricingOptions', [{}])[0].get('price', {}).get('amount')
                    raw_price = int(price) / 1000 if price else 0
                    
                    leg_id = i_data.get('legIds', [None])[0]
                    leg_data = legs.get(leg_id, {})
                    
                    departure = leg_data.get('departureDateTime', {})
                    arrival = leg_data.get('arrivalDateTime', {})
                    
                    yy = str(year)[-2:]
                    mm = f"{month:02d}"
                    dd = f"{day:02d}"
                    skyscanner_web_link = f"https://www.skyscanner.net/transport/flights/{origin_iata.lower()}/{dest_iata.lower()}/{yy}{mm}{dd}/"

                    flight_info = {
                        "dest": dest_iata,
                        "price": f"{raw_price:.2f} EUR",
                        "raw_price_val": raw_price,
                        "departure": f"{departure.get('day')}/{departure.get('month')} {departure.get('hour')}:{departure.get('minute')}",
                        "arrival": f"{arrival.get('day')}/{arrival.get('month')} {arrival.get('hour')}:{arrival.get('minute')}",
                        "stops": leg_data.get('stopCount', 0),
                        "is_direct": leg_data.get('stopCount', 0) == 0,
                        "booking_link": skyscanner_web_link,
                        "flight_date": f"{year}-{month:02d}-{day:02d}"
                    }
                    all_flights.append(flight_info)
            except Exception as e:
                print(f"Error on date {current_date}: {e}")
                continue

        # Sort all aggregated flights by price
        sorted_flights = sorted(all_flights, key=lambda x: x['raw_price_val'])
        return sorted_flights[:10]

def get_flights_for_destinations(destinations):
    service = SkyscannerService()
    final_results = {}
    
    for dest in destinations:
        if len(dest) == 5:
            city, dest_iata, origin_iata, date_str, date_end = dest
        else:
            city, dest_iata, origin_iata, date_str = dest
            date_end = None
            
        print(f"🔎 Tražim letove od {origin_iata} do {dest_iata} počevši od {date_str}...")
        final_results[city] = service.get_best_flights(dest_iata, origin_iata, date_str, date_end)
        
    return final_results

if __name__ == "__main__":
    # Testiraj sa listom gradova
    test_cities = ["PAR", "LON"]
    results = get_flights_for_destinations(test_cities)
    
    # Ispis samo bitnih podataka
    print("\n✈️ NAJBOLJE PONUDE LETOVA:")
    print("="*50)
    print(json.dumps(results, indent=4))