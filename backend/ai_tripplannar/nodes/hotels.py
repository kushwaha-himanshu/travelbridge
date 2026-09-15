from graph.state import TripState
from tools.hotels_tool import search_hotels
import json


def hotel_research(state: TripState):

    print("===== HOTEL RESEARCH =====")

    destination = state["destination"]
    travelers = state["travelers"]

    check_in = state.get("check_in")
    check_out = state.get("check_out")

    if not check_in or not check_out:
        return {
            "hotels": [],
            "warnings": [
                "Check-in and check-out dates are required for hotel search."
            ]
        }

    try:

        hotels = search_hotels(
            destination=destination,
            check_in=check_in,
            check_out=check_out,
            travelers=travelers,
            limit=5
        )

        print("Hotels found:", len(hotels))

        return {
            "hotels": hotels
        }

    except Exception as e:

        print("Hotel API error:", str(e))

        return {
            "hotels": [],
            "warnings": [
                f"Hotel search failed: {str(e)}"
            ]
        }
