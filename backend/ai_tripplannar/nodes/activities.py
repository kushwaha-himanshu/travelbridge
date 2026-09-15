from graph.state import TripState
from tools.places_tool import search_places

def activities_research(state: TripState):
    print("===== [NODE] ACTIVITIES RESEARCH =====")
    destination = state.get("destination", "")
    interests = state.get("interests", [])
    if not interests:
        interests = ["sightseeing", "culture", "nature"]

    activities = []
    seen_names = set()

    try:
        for interest in interests[:3]:  # Top 3 interests
            places = search_places(destination=destination, interest=interest, limit=4)
            for place in places:
                name_key = place.get("name", "").lower()
                if name_key and name_key not in seen_names:
                    seen_names.add(name_key)
                    activities.append({
                        "id": place.get("id") or f"act-{len(activities)+1}",
                        "name": place.get("name"),
                        "category": interest,
                        "location": place.get("address") or destination,
                        "rating": place.get("rating") or 4.5,
                        "description": f"Must-visit {interest} destination in {destination}.",
                        "duration_minutes": 120,
                        "google_maps_url": place.get("google_maps_url")
                    })

        # If none found, add standard landmarks for the destination
        if not activities:
            activities.append({
                "id": "act-1",
                "name": f"Historic Center of {destination}",
                "category": "culture",
                "location": f"Central District, {destination}",
                "rating": 4.7,
                "description": f"Explore the architectural heritage, lively plazas, and iconic monuments of {destination}.",
                "duration_minutes": 120,
                "google_maps_url": None
            })

        print(f"[Activities] Collected {len(activities)} unique attractions")
        return {"activities": activities}
    except Exception as e:
        print(f"[Activities] Error: {e}")
        return {
            "activities": [],
            "warnings": [f"Attractions search experienced an issue: {str(e)}"]
        }