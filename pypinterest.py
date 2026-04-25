import requests
from bs4 import BeautifulSoup
import json
import re

def get_pinterest_board_images(board_url):
    print(f"--- Izvlačenje slika sa: {board_url} ---")
    
    # Dodajemo 'User-Agent' da Pinterest ne bi blokirao zahtev
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    response = requests.get(board_url, headers=headers)
    if response.status_code != 200:
        print(f"Greška pri pristupu: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Pinterest čuva podatke u JSON formatu unutar <script> taga sa id-em '__PWS_DATA__'
    script_tag = soup.find('script', {'id': '__PWS_DATA__'})
    
    image_urls = []

    if script_tag:
        try:
            json_data = json.loads(script_tag.string)
            # Kopamo kroz Pinterestovu kompleksnu JSON strukturu do Pin-ova
            # Napomena: Struktura se može promeniti, ali ovo je trenutni standard
            pins = json_data.get('props', {}).get('initialReduxState', {}).get('pins', {})
            
            for pin_id in pins:
                pin_data = pins[pin_id]
                images = pin_data.get('images', {})
                # Uzimamo 'orig' (originalnu) ili '736x' (veliku) verziju slike
                img_url = images.get('orig', {}).get('url')
                if img_url:
                    image_urls.append(img_url)
        except Exception as e:
            print(f"Greška pri parsiranju JSON-a: {e}")
    
    # Ako JSON metod ne uspe, koristimo 'fallback' sa regularnim izrazima
    if not image_urls:
        print("Pokušavam alternativni metod...")
        # Tražimo sve linkove koji završavaju na .jpg ili .png unutar HTML-a
        image_urls = list(set(re.findall(r'(https://i\.pinimg\.com/originals/[^\s"\'<>]+)', response.text)))

    return image_urls

# TESTIRANJE
# Stavi link do nekog JAVNOG board-a
test_url = "https://www.pinterest.com/natalijagvozden/travel/" # Zameni sa tvojim pravim URL-om board-a
slike = get_pinterest_board_images(test_url)

print(f"\nPronađeno ukupno {len(slike)} slika:")
for url in slike[:5]: # Ispisuje prvih 5
    print(f" - {url}")