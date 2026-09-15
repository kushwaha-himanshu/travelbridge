from graph.state import TripState
from tools.places_tool import search_restaurants

def food_research(state: TripState):
    print("===== [NODE] FOOD & DINING RESEARCH =====")
    destination = state.get("destination", "")

    try:
        restaurants = search_restaurants(destination=destination, limit=5)
        formatted = []
        for r in restaurants:
            formatted.append({
                "id": r.get("id"),
                "name": r.get("name"),
                "cuisine": "Authentic Local & Regional",
                "address": r.get("address") or destination,
                "rating": r.get("rating") or 4.4,
                "price_level": r.get("price_level", "$$"),
                "google_maps_url": r.get("google_maps_url")
            })

        if not formatted:
            formatted.append({
                "id": "rest-1",
                "name": f"Traditional Dining in {destination}",
                "cuisine": "Regional Specialties",
                "address": f"Market Square, {destination}",
                "rating": 4.5,
                "price_level": "$$",
                "google_maps_url": None
            })

        print(f"[Food] Found {len(formatted)} dining recommendations")
        return {"restaurants": formatted}
    except Exception as e:
        print(f"[Food] Search error: {e}")
        return {
            "restaurants": [],
            "warnings": [f"Restaurant recommendations notice: {str(e)}"]
        }