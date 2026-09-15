from graph.state import TripState
from typing import Dict, Any, List

def finalizer(state: TripState) -> Dict[str, Any]:
    print("===== [NODE] FINALIZER (STRUCTURING OUTPUT) =====")
    
    destination = state.get("destination", "Unknown Destination")
    dest_info = state.get("destination_info", {})
    weather = state.get("weather", [])
    hotels = state.get("hotels", [])
    activities = state.get("activities", [])
    restaurants = state.get("restaurants", [])
    itinerary = state.get("itinerary", [])
    optimized_routes = state.get("optimized_routes", [])
    budget_breakdown = state.get("budget_breakdown", {})
    warnings = state.get("warnings", [])

    # Default travel tips
    tips = [
        f"Keep local currency ({state.get('currency', 'INR')}) handy for street stalls and local public transit.",
        "Early morning visits to major cultural attractions avoid midday crowds and heat.",
        "Check local holiday operating hours and museum closures prior to heading out."
    ]

    weather_summary = "Pleasant travel conditions expected."
    if weather and len(weather) > 0:
        first_w = weather[0]
        weather_summary = f"{first_w.get('condition', 'Pleasant')} with temperatures between {first_w.get('temperature_min')}°C and {first_w.get('temperature_max')}°C."

    # Format into unified stable contract
    final_plan: Dict[str, Any] = {
        "trip": {
            "destination": destination,
            "days": state.get("days", 3),
            "travelers": state.get("travelers", 2),
            "budget": state.get("budget", 40000.0),
            "currency": state.get("currency", "INR"),
            "travel_style": state.get("travel_style", "moderate"),
            "check_in": state.get("check_in", ""),
            "check_out": state.get("check_out", "")
        },
        "destination": {
            "name": dest_info.get("name", destination),
            "latitude": dest_info.get("latitude"),
            "longitude": dest_info.get("longitude"),
            "country": dest_info.get("country", ""),
            "summary": dest_info.get("summary") or dest_info.get("research", "")[:250]
        },
        "weather": {
            "summary": weather_summary,
            "forecast": weather
        },
        "hotels": hotels,
        "activities": activities,
        "restaurants": restaurants,
        "itinerary": itinerary,
        "routes": optimized_routes,
        "budget": budget_breakdown,
        "tips": tips,
        "warnings": warnings
    }

    print(f"[Finalizer] Assembled complete plan with {len(itinerary)} days, {len(hotels)} hotels, {len(activities)} activities.")
    return {
        "final_plan": final_plan
    }