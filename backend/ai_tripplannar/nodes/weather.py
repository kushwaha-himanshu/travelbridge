from graph.state import TripState
from tools.weather_tool import get_weather

def weather_research(state: TripState):
    print("===== [NODE] WEATHER RESEARCH =====")
    destination_info = state.get("destination_info", {})
    latitude = destination_info.get("latitude")
    longitude = destination_info.get("longitude")
    days = state.get("days", 3)

    if latitude is None or longitude is None:
        print("[Weather] Coordinates missing, weather research skipped")
        return {
            "weather": [],
            "warnings": ["Real-time weather forecast unavailable due to unresolved destination coordinates."]
        }

    try:
        weather_data = get_weather(
            latitude=latitude,
            longitude=longitude,
            forecast_days=min(days, 10)
        )
        print(f"[Weather] Retrieved forecast for {len(weather_data)} days")
        return {"weather": weather_data}
    except Exception as e:
        print(f"[Weather] Error: {e}")
        return {
            "weather": [],
            "warnings": [f"Weather service update: {str(e)}"]
        }