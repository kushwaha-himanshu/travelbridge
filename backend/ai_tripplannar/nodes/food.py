from graph.state import TripState
from tools.places_tool import search_restaurants


def food_research(state: TripState):

    print("===== FOOD RESEARCH =====")

    destination = state["destination"]

    try:

        restaurants = search_restaurants(
            destination=destination,
            limit=5
        )

        print(
            "Restaurants found:",
            len(restaurants)
        )

        return {
            "restaurants": restaurants
        }

    except Exception as e:

        print(
            "Food API error:",
            str(e)
        )

        return {
            "restaurants": [],
            "warnings": [
                f"Food search failed: {str(e)}"
            ]
        }