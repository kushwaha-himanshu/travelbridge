from graph.state import TripState
from typing import List, Dict, Any

def route_optimizer(state: TripState):
    print("===== [NODE] ROUTE OPTIMIZER =====")
    transport_options = state.get("transport_options", [])
    itinerary = state.get("itinerary", [])

    optimized_routes: List[Dict[str, Any]] = []

    for day_obj in itinerary:
        day_num = day_obj.get("day")
        # Find matching transport option or construct default
        matching = next((t for t in transport_options if t.get("day") == day_num), None)
        
        activities = day_obj.get("activities", [])
        waypoint_names = [a.get("name") for a in activities if isinstance(a, dict) and a.get("name")]
        
        dist_m = matching.get("distance_meters", 12000) if matching else 12000
        dur_str = matching.get("duration", "25 mins") if matching else "25 mins"

        optimized_routes.append({
            "day": day_num,
            "distance_meters": dist_m,
            "distance_km": round(dist_m / 1000.0, 1),
            "duration": dur_str,
            "route_order": waypoint_names if waypoint_names else [f"Area {day_num}"],
            "legs": matching.get("legs", []) if matching else []
        })

    print(f"[Route Optimizer] Generated {len(optimized_routes)} daily transit plans")
    return {"optimized_routes": optimized_routes}