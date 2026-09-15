from graph.state import TripState
from tools.routes_tool import calculate_route


def transport_research(state: TripState):

    print("===== TRANSPORT RESEARCH =====")

    activities = state.get("activities", [])
    restaurants = state.get("restaurants", [])

    places = []

    places.extend(activities[:3])
    places.extend(restaurants[:2])

    print("Transport places:", len(places))

    if len(places) < 2:
        return {
            "transport_options": [],
            "warnings": [
                "Not enough locations available to calculate routes."
            ]
        }

    try:

        print("\n===== TRANSPORT PLACES =====")

        for place in places:
            print(place)

        # Check your actual location structure here
        first_location = places[0]["location"]
        last_location = places[-1]["location"]

        origin = {
            "latitude": first_location.get(
                "latitude",
                first_location.get("lat")
            ),
            "longitude": first_location.get(
                "longitude",
                first_location.get("lng")
            )
        }

        destination = {
            "latitude": last_location.get(
                "latitude",
                last_location.get("lat")
            ),
            "longitude": last_location.get(
                "longitude",
                last_location.get("lng")
            )
        }

        # Make sure coordinates exist
        if (
            origin["latitude"] is None
            or origin["longitude"] is None
            or destination["latitude"] is None
            or destination["longitude"] is None
        ):
            raise ValueError(
                "Location coordinates are missing."
            )

        intermediates = []

        for place in places[1:-1]:

            location = place["location"]

            lat = location.get(
                "latitude",
                location.get("lat")
            )

            lng = location.get(
                "longitude",
                location.get("lng")
            )

            if lat is None or lng is None:
                continue

            intermediates.append({
                "latitude": lat,
                "longitude": lng
            })

        route = calculate_route(
            origin=origin,
            destination=destination,
            intermediates=intermediates,
            travel_mode="DRIVE"
        )

        print("Transport route generated")

        return {
            "transport_options": [route]
        }

    except Exception as e:

        print("Transport API error:", str(e))

        return {
            "transport_options": [],
            "warnings": [
                f"Transport search failed: {str(e)}"
            ]
        }