from graph.state import TripState
from tools.routes_tool import calculate_route

def transport_research(state: TripState):
    print("===== [NODE] TRANSPORT & MOBILITY =====")
    destination_info = state.get("destination_info", {})
    activities = state.get("activities", [])
    restaurants = state.get("restaurants", [])
    days = state.get("days", 3)

    lat = destination_info.get("latitude")
    lon = destination_info.get("longitude")

    if not lat or not lon:
        return {
            "transport_options": [],
            "warnings": ["Transit route optimization skipped: destination coordinates missing."]
        }

    # Generate daily mobility summaries
    transport_options = []
    try:
        # Check routes between key points
        sample_locs = []
        for a in activities[:3]:
            loc = a.get("location")
            if isinstance(loc, dict) and loc.get("latitude") and loc.get("longitude"):
                sample_locs.append(loc)
        for r in restaurants[:2]:
            loc = r.get("location")
            if isinstance(loc, dict) and loc.get("latitude") and loc.get("longitude"):
                sample_locs.append(loc)

        if len(sample_locs) >= 2:
            route = calculate_route(
                origin=sample_locs[0],
                destination=sample_locs[-1],
                intermediates=sample_locs[1:-1]
            )
            dist_meters = route.get("distance_meters", 15000)
            duration_str = route.get("duration", "25 mins")
        else:
            dist_meters = 12000
            duration_str = "20 mins"

        for d in range(1, days + 1):
            transport_options.append({
                "day": d,
                "distance_meters": dist_meters,
                "distance_km": round(dist_meters / 1000.0, 1),
                "duration": duration_str,
                "route_order": [f"Area Hub {d}", f"Main Sight {d}", f"Dining District {d}"],
                "legs": [
                    {
                        "origin": f"Central District Day {d}",
                        "destination": f"Attraction Cluster Day {d}",
                        "distance_meters": dist_meters // 2,
                        "duration": "12 mins"
                    }
                ]
            })

        return {"transport_options": transport_options}
    except Exception as e:
        print(f"[Transport] Error: {e}")
        return {
            "transport_options": [],
            "warnings": [f"Transit routing update: {str(e)}"]
        }