from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
import io
from PIL import Image

# Import existing logic
from pypinterest import get_pinterest_board_images, prepare_images_for_gemini
from agent import analyze_visual_vibe, get_destination_recommendations
from skyscanner import get_flights_for_destinations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/api/discover')
async def discover(request: Request):
    try:
        data = await request.json()
        source = data.get('source')
        desired_features = data.get('desired_features', '')
        
        pil_images = []
        
        if source == 'pinterest':
            url = data.get('url')
            if not url:
                return JSONResponse(status_code=400, content={'error': 'Pinterest URL is required'})
                
            raw_urls = get_pinterest_board_images(url)
            pil_images = prepare_images_for_gemini(raw_urls)
            
        elif source == 'images':
            images_b64 = data.get('images', [])
            if not images_b64:
                return JSONResponse(status_code=400, content={'error': 'Images are required'})
                
            for b64 in images_b64:
                try:
                    if ',' in b64:
                        b64 = b64.split(',')[1]
                    image_data = base64.b64decode(b64)
                    img = Image.open(io.BytesIO(image_data))
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    pil_images.append(img)
                except Exception as e:
                    print(f"Error decoding image: {e}")
                    
        else:
            return JSONResponse(status_code=400, content={'error': 'Invalid source'})
            
        if not pil_images:
            return JSONResponse(status_code=400, content={'error': 'No valid images could be processed'})
            
        # Step 1: Visual Analysis
        visual_context = analyze_visual_vibe(pil_images)
        
        # Step 2: Recommendations
        final_data = get_destination_recommendations(visual_context, desired_features)
        
        return final_data
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={'error': str(e)})

@app.post('/api/flights')
async def flights(request: Request):
    try:
        data = await request.json()
        city = data.get('city')
        
        if not city:
            return JSONResponse(status_code=400, content={'error': 'City is required'})
            
        results = get_flights_for_destinations([city])
        city_results = results.get(city, [])
        
        if isinstance(city_results, dict) and 'error' in city_results:
            return JSONResponse(status_code=500, content={'error': city_results['error']})
            
        return {'flights': city_results}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={'error': str(e)})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
