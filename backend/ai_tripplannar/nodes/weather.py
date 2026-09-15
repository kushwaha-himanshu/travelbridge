from graph.state import TripState
from tools.weather_tool import get_weather


# def weather_research(state: TripState):

#     print("===== WEATHER RESEARCH =====")

#     destination_info = state.get(
#         "destination_info",
#         {}
#     )

#     latitude = destination_info.get(
#         "latitude"
#     )

#     longitude = destination_info.get(
#         "longitude"
#     )

#     if latitude is None or longitude is None:

#         return {
#             "warnings": [
#                 "Latitude and longitude are required for weather search."
#             ]
#         }

#     try:

#         weather = get_weather(
#             latitude=latitude,
#             longitude=longitude,
#             forecast_days=min(
#                 state.get("days", 7),
#                 7
#             )
#         )

#         print(
#             "Weather days found:",
#             len(weather)
#         )

#         return {
#             "weather": weather
#         }

#     except Exception as e:

#         print(
#             "Weather API error:",
#             str(e)
#         )

#         return {
#             "weather": [],
#             "warnings": [
#                 f"Weather search failed: {str(e)}"
#             ]
#         }


def weather_research(state: TripState):

    print("===== WEATHER RESEARCH =====")

    destination_info = state.get("destination_info", {})

    print("DESTINATION INFO:", destination_info)
    print("LATITUDE:", destination_info.get("latitude"))
    print("LONGITUDE:", destination_info.get("longitude"))

    latitude = destination_info.get("latitude")
    longitude = destination_info.get("longitude")

    if latitude is None or longitude is None:
        print("Weather skipped: coordinates missing")
        return {
            "weather": [],
            "warnings": [
                "Latitude and longitude are required for weather search."
            ]
        }

    try:
        weather = get_weather(
            latitude=latitude,
            longitude=longitude,
            forecast_days=min(state.get("days", 7), 7)
        )

        print("Weather days found:", len(weather))

        return {
            "weather": weather
        }

    except Exception as e:
        print("Weather API error:", str(e))

        return {
            "weather": [],
            "warnings": [
                f"Weather search failed: {str(e)}"
            ]
        }