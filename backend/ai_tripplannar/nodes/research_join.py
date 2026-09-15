from graph.state import TripState


def research_join(state: TripState):

    print("===== RESEARCH JOIN =====")

    hotels = state.get("hotels", [])
    activities = state.get("activities", [])
    restaurants = state.get("restaurants", [])

    print("Hotels:", len(hotels))
    print("Activities:", len(activities))
    print("Restaurants:", len(restaurants))

    return {
        "hotels": hotels,
        "activities": activities,
        "restaurants": restaurants
    }