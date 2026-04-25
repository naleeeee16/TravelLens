import os
import json
import base64
import io
from dotenv import load_dotenv
from openai import OpenAI
from pypinterest import get_pinterest_board_images, prepare_images_for_gemini

load_dotenv()

# Inicijalizacija klijenta
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- POMOĆNE FUNKCIJE ---

def encode_image_to_base64(pil_image):
    """Pretvara PIL sliku u base64 string za OpenAI API."""
    buffered = io.BytesIO()
    pil_image.save(buffered, format="JPEG", quality=85)
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

# --- KORAK 1: VISION ANALIZA ---

def analyze_visual_vibe(pil_images):
    """
    Šalje slike na GPT-4o da izvuče tagove, landmarke i atmosferu.
    """
    print(f"[1/2] Step 1: Analyzing {len(pil_images[:5])} valid travel images...")

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
      "extracted_tags": ["Min 10 detailed tags"],
      "landmarks_found": ["Specific names or 'None'"],
      "primary_vibe": "Sophisticated description",
      "suggested_season": "Best time to visit"
    }
    """

    image_contents = []
    for img in pil_images[:5]:
        b64 = encode_image_to_base64(img)
        image_contents.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}", "detail": "high"}
        })

    messages_content = [{"type": "text", "text": step1_prompt}] + image_contents

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": messages_content}],
        response_format={"type": "json_object"},
        max_completion_tokens=500
    )
    
    result = json.loads(response.choices[0].message.content)
    print(f"      [✓] Analysis complete: {result}...")
    return result

# --- KORAK 2: LOGIČKA PREPORUKA ---

def get_destination_recommendations(visual_context, user_filter):
    """
    Na osnovu vizuelnog konteksta i korisničkog filtera predlaže 6 destinacija.
    """
    print("[2/2] Step 2: Generating destinations (Logic only)...")
    
    step2_prompt = f"""
    You are a Strategic Travel Intelligence Engine. Your task is to calculate and rank exactly 6 destinations using a strict scoring algorithm.

    Visual Context (The Vibe):
    {json.dumps(visual_context, indent=2)}

    User's Explicit Constraint (The Filter):
    "{user_filter}"

    SCORING ALGORITHM:
    Base the recommendations on visual match and user filters, but DO NOT output the math or formula.

    MANDATORY LOGIC:
    1. USER OVERRIDE: Every result MUST be within: "{user_filter}".
    2. QUANTITY: Exactly 6 distinct destinations.

    Return ONLY a JSON object:
    {{
      "common_theme": "Description",
      "top_destinations": [
        {{ 
          "city": "City, Country", 
          "reason": "Compelling 2-sentence travel pitch. NO math, NO formulas.", 
          "match_percentage": 95,
          "primary_vibe": "e.g. Romantic coastal escape",
          "extracted_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
          "suggested_season": "Best time to visit"
        }}
      ]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional travel consultant."},
            {"role": "user", "content": step2_prompt}
        ],
        response_format={"type": "json_object"},
        max_completion_tokens=1000
    )
    
    return json.loads(response.choices[0].message.content)

# --- KORAK 3: FORMATIRANJE ISPISA ---

def display_results(final_data):
    """Ispisuje tabelarni prikaz u terminal."""
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

# --- MAIN LOOP ---

def run_travelens():
    print("\n" + "="*50)
    print(" TRAVELENS: VISION TO TEXT PIPELINE")
    print("="*50)

    url = input("\n[?] Paste Pinterest Board URL: ").strip()
    
    # 1. Fetching images
    raw_urls = get_pinterest_board_images(url)
    pil_slike = prepare_images_for_gemini(raw_urls)
    
    if not pil_slike:
        print("[!] No images found. Pinterest might be blocking the request.")
        return

    try:
        # Korak 1: Vizuelna analiza
        visual_context = analyze_visual_vibe(pil_slike)

        # Korak 2: Korisnički unos i logika
        print('\nInput user message for Step 2 (Logic):')
        user_filter = input("> ")
        
        final_data = get_destination_recommendations(visual_context, user_filter)

        # Korak 3: Prikaz
        display_results(final_data)

    except Exception as e:
        print(f"\n[✗] Pipeline Error: {e}")

if __name__ == "__main__":
    while True:
        run_travelens()
        if input("\nPress Enter to run again or 'q' to quit: ").lower() == 'q':
            break