# TravelLens

TravelLens je AI-powered aplikacija za otkrivanje putovanja koja analizira slike koristeći Google Gemini AI da izvuče karakteristike i predloži destinacije na osnovu zajedničkih tema.

## Installation

   ```bash
   pip install -r requirements.txt
   ```

3. Postavite Google Gemini API ključ u `agent.py` (trenutno je hardkodovan)

## Korišćenje

### Pokretanje API servera

```bash
uvicorn agent:app --reload
```

### API Endpoint

- `GET /travel-board`: Analizira slike u `images/` folderu i vraća preporuke destinacija

## Zavisnosti

- fastapi: Web framework
- uvicorn: ASGI server
- google-generativeai: Google Gemini AI
- requests: HTTP zahtevi
- beautifulsoup4: HTML parsing

## Primer izlaza

API vraća JSON sa analizom svake slike i konačnim preporukama destinacija na osnovu zajedničkih tema.
