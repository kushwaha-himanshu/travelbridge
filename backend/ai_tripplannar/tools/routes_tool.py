import os
import requests
from dotenv import load_dotenv

load_dotenv()

GOOGLE_ROUTES_API_KEY = os.getenv("GOOGLE_ROUTES_API_KEY")

URL = "https://routes.googleapis.com/directions/v2:computeRoutes"


def make_waypoint(latitude, longitude):
    return {
        "location": {
            "latLng": {
                "latitude": latitude,
                "longitude": longitude
            }
        }
    }


def calculate_route(
    origin,
    destination,
    intermediates=None,
    travel_mode="DRIVE"
):

    if not GOOGLE_ROUTES_API_KEY:
        raise ValueError(
            "GOOGLE_ROUTES_API_KEY is not configured"
        )

    if intermediates is None:
        intermediates = []

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_ROUTES_API_KEY,

        "X-Goog-FieldMask": (
            "routes.distanceMeters,"
            "routes.duration,"
            "routes.staticDuration,"
            "routes.polyline.encodedPolyline,"
            "routes.legs.distanceMeters,"
            "routes.legs.duration,"
            "routes.optimizedIntermediateWaypointIndex"
        )
    }

    body = {
        "origin": make_waypoint(
            origin["latitude"],
            origin["longitude"]
        ),

        "destination": make_waypoint(
            destination["latitude"],
            destination["longitude"]
        ),

        "travelMode": travel_mode,

        "languageCode": "en",

        "units": "METRIC",

        "optimizeWaypointOrder": bool(
            intermediates
        )
    }

    if intermediates:

        body["intermediates"] = [
            make_waypoint(
                place["latitude"],
                place["longitude"]
            )
            for place in intermediates
        ]

    response = requests.post(
        URL,
        headers=headers,
        json=body,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    routes = data.get("routes", [])

    if not routes:
        return {
            "success": False,
            "routes": []
        }

    route = routes[0]

    return {
        "success": True,

        "distance_meters": route.get(
            "distanceMeters"
        ),

        "duration": route.get(
            "duration"
        ),

        "static_duration": route.get(
            "staticDuration"
        ),

        "optimized_waypoint_order": route.get(
            "optimizedIntermediateWaypointIndex",
            []
        ),

        "polyline": route.get(
            "polyline",
            {}
        ).get(
            "encodedPolyline"
        ),

        "legs": route.get(
            "legs",
            []
        )
    }