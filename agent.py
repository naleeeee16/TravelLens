import os
import json
import base64
import io
from dotenv import load_dotenv
from openai import OpenAI
from pypinterest import get_pinterest_board_images, prepare_images_for_gemini

load_dotenv()
from skyscanner import get_flights_for_destinations

#app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image_to_base64(pil_image):
    buffered = io.BytesIO()
    pil_image.save(buffered, format="JPEG", quality=85)
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def main():
    print("\n" + "="*50)
    print(" TRAVELENS: VISION TO TEXT PIPELINE")
    print("="*50)

    url = input("\n[?] Paste Pinterest Board URL: ").strip()
    
    step1_prompt = """
    Act as a professional Travel Scouter and Cultural Geographer. 
    Analyze the provided images to extract deep travel insights. 

    Focus on identifying:
    1. Architectural styles (e.g., Gothic, Haussmann, Brutalist, Tropical Modernism).
    2. Geographic markers (e.g., coastal, alpine, dense urban, desert).
    3. Culinary indicators (e.g., street food stalls, fine dining, vineyard).
    4. Activity cues (e.g., hiking, shopping, museum-hopping, nightlife).
    5. Color palette & Lighting (e.g., golden hour, neon-lit, pastel-toned).

    Return ONLY a JSON object:
    {
      "extracted_tags": [
          "Minimum 10 detailed tags covering: architecture, terrain, weather vibes, 
          and specific cultural elements"
      ],
      "landmarks_found": ["Specific names or 'None'"],
      "primary_vibe": "A sophisticated description of the travel experience (e.g., 'Luxury European slow-travel' or 'High-energy Asian urban exploration')",
      "suggested_season": "Best time to visit based on the visual evidence"
    }
    """

    # 1. Fetching (Ovo ostaje isto)
    raw_urls = get_pinterest_board_images(url)
    pil_slike = prepare_images_for_gemini(raw_urls)
    
    if not pil_slike:
        print("[!] No images found. Pinterest might be blocking the request.")
        return

    # --- NOVI DEO: Umesto kolaža, pripremamo listu slika za OpenAI ---
    print(f"[1/2] Step 1: Analyzing {len(pil_slike)} valid travel images...")    
   
    # Uzimamo prvih 5 slika sa boarda (to je sasvim dovoljno za vibe)
    image_contents = []
    for img in pil_slike[:5]:
        b64 = encode_image_to_base64(img)
        image_contents.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}", "detail": "high"}
        })

    # Dodajemo tekstualni prompt na početak liste
    messages_content = [{"type": "text", "text": step1_prompt}] + image_contents

    try:
        response_1 = client.chat.completions.create(
            model="gpt-4o", # Obavezno gpt-4o
            messages=[
                {
                    "role": "user",
                    "content": messages_content # Šaljemo celu listu slika
                }
            ],
            response_format={ "type": "json_object" },
            max_completion_tokens=500
        )
        visual_context = json.loads(response_1.choices[0].message.content)
        print(f"      [✓] Analysis complete: {visual_context}...")
    except Exception as e:
        print(f"\n[✗] Step 1 Error: {e}")
        return

    # ---------------------------------------------------------
    # KORAK 2: PREPORUKA DESTINACIJA (Samo TEKST - nema slike!)
    # ---------------------------------------------------------
    print("[2/2] Step 2: Generating destinations (Logic only)...")
    
    # Ovde šaljemo JSON iz prvog koraka kao tekstualni kontekst
    print('Input user message for Step 2 (Logic):')
    mess = input()

    # Pretpostavljamo da je 'mess' ono što je korisnik ukucao
    step2_prompt = f"""
    You are a Strategic Travel Intelligence Engine. Your task is to calculate and rank exactly 6 destinations using a strict scoring algorithm.

    Visual Context (The Vibe):
    {json.dumps(visual_context, indent=2)}

    User's Explicit Constraint (The Filter):
    "{mess}"

    SCORING ALGORITHM (Strictly follow this for 'match_percentage'):
    The total score is 100 points, divided into two categories:
    1. FEATURES SCORE (50%): 
       - Formula: (50 / total_number_of_extracted_tags) * (tags_present_at_destination)
    2. LANDMARKS SCORE (50%):
       - Formula: (50 / total_number_of_landmarks_found) * (landmarks_actually_in_this_city)
       - Note: If 'landmarks_found' is empty, redistribute this 50% to the 'Vibe/Aesthetic Consistency' with the images.

    MANDATORY LOGIC:
    1. USER OVERRIDE: Every result MUST be within: "{mess}".
    2. QUANTITY: You MUST return exactly 6 distinct destinations.
    3. CALCULATION: In the 'reason' field, briefly mention why the score is such (e.g., "Matches 4/5 features and contains the main landmark").

    Return ONLY a JSON object:
    {{
      "common_theme": "Description of the vibe",
      "top_destinations": [
        {{
          "city": "City, Country",
          "reason": "Explain the match based on the 50/50 formula",
          "match_percentage": "Integer value calculated by the algorithm"
        }},
        {{ "city": "...", "reason": "...", "match_percentage": 0 }},
        {{ "city": "...", "reason": "...", "match_percentage": 0 }},
        {{ "city": "...", "reason": "...", "match_percentage": 0 }},
        {{ "city": "...", "reason": "...", "match_percentage": 0 }},
        {{ "city": "...", "reason": "...", "match_percentage": 0 }}
      ]
    }}
    """

    try:
        # PRIMETI: Ovde nema image_url, samo obična tekstualna poruka
        # --- IZMENA U KORAKU 2 ---
        response_2 = client.chat.completions.create(
            model="gpt-4o-mini",  # Koristi stabilan mini model za logiku
            messages=[
                {"role": "system", "content": "You are a professional travel consultant."},
                {"role": "user", "content": step2_prompt}
            ],
            response_format={ "type": "json_object" },
            max_completion_tokens=1000
        )
        final_data = json.loads(response_2.choices[0].message.content)

        # final_recommendations = get_destinations(all_features)
        
        # # ISPIS FINALNOG REZULTATA U TERMINALU
        # print("\n🌍 PREDLOŽENE DESTINACIJE:")
        # print(json.dumps(final_recommendations, indent=4, ensure_ascii=False))
        # print("\n" + "="*50)

        # # 2. Izvuci samo imena gradova iz JSON-a koji je vratio Gemini
        # cities = [d['city'] for d in final_recommendations['top_destinations']]
        
        # # 3. Pozovi Skyscanner funkciju
        # flights = get_flights_for_destinations(cities)
    except Exception as e:
        print(f"\n[✗] Step 2 Error: {e}")
        return

    # ---------------------------------------------------------
    # FINALNI ISPIS
    # ---------------------------------------------------------
    print("\n" + "="*60)
    print(f"THEME: {final_data.get('common_theme', 'N/A')}")
    print("-"*60)
    print(f"{'CITY':<25} | {'MATCH':<7} | {'REASON'}")
    print("-"*60)
    
    for d in final_data.get('top_destinations', []):
        city = d.get('city', 'Unknown')
        match = f"{d.get('match_percentage')}%"
        reason = d.get('reason', 'N/A')
        print(f"{city:<25} | {match:<7} | {reason}")
        
    print("="*60)
    print("\n[✓] Done! (Step 1 used Vision, Step 2 used Text logic)")

if __name__ == "__main__":
    while (True):
        main()