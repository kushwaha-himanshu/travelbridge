from graph.state import TripState
from tools.places_tool import search_places


def activities_research(state: TripState):

    print("===== ACTIVITY RESEARCH =====")

    destination = state["destination"]
    interests = state.get("interests", [])

    activities = []
    seen_ids = set()

    try:

        for interest in interests:

            print(
                f"Searching {interest} activities in {destination}"
            )

            places = search_places(
                destination=destination,
                interest=interest,
                limit=5
            )

            for place in places:

                place_id = place.get("id")

                if place_id and place_id not in seen_ids:
                    seen_ids.add(place_id)
                    activities.append(place)

        print(
            "Unique activities found:",
            len(activities)
        )

        return {
            "activities": activities
        }

    except Exception as e:

        print("Activity API error:", str(e))

        return {
            "activities": [],
            "warnings": [
                f"Activity search failed: {str(e)}"
            ]
        }