import os
import math
import requests
from typing import Dict, Any, List, Optional
from config import GOOGLE_ROUTES_API_KEY

URL = "https://routes.googleapis.com/directions/v2:computeRoutes"

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points in meters."""
    R = 6371000  # Radius of earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def make_waypoint(latitude: float, longitude: float) -> Dict[str, Any]:
    return {
        "location": {
            "latLng": {
                "latitude": latitude,
                "longitude": longitude
            }
        }
    }

def calculate_route(
    origin: Dict[str, float],
    destination: Dict[str, float],
    intermediates: Optional[List[Dict[str, float]]] = None,
    travel_mode: str = "DRIVE"
) -> Dict[str, Any]:
    """
    Computes routes between origin, destination, and intermediate waypoints
    using Google Routes API or mathematical distance fallback.
    """
    if intermediates is None:
        intermediates = []

    o_lat = origin.get("latitude")
    o_lon = origin.get("longitude")
    d_lat = destination.get("latitude")
    d_lon = destination.get("longitude")

    if None in (o_lat, o_lon, d_lat, d_lon):
        return {
            "success": False,
            "distance_meters": 0,
            "duration": "0s",
            "legs": []
        }

    if GOOGLE_ROUTES_API_KEY:
        try:
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
                "origin": make_waypoint(o_lat, o_lon),
                "destination": make_waypoint(d_lat, d_lon),
                "travelMode": travel_mode,
                "languageCode": "en",
                "units": "METRIC",
                "optimizeWaypointOrder": bool(intermediates)
            }
            if intermediates:
                body["intermediates"] = [
                    make_waypoint(p["latitude"], p["longitude"])
                    for p in intermediates if p.get("latitude") and p.get("longitude")
                ]

            response = requests.post(URL, headers=headers, json=body, timeout=15)
            if response.status_code == 200:
                data = response.json()
                routes = data.get("routes", [])
                if routes:
                    route = routes[0]
                    return {
                        "success": True,
                        "distance_meters": route.get("distanceMeters", 0),
                        "duration": route.get("duration", "0s"),
                        "static_duration": route.get("staticDuration"),
                        "optimized_waypoint_order": route.get("optimizedIntermediateWaypointIndex", []),
                        "polyline": route.get("polyline", {}).get("encodedPolyline"),
                        "legs": route.get("legs", [])
                    }
        except Exception as e:
            print(f"[Routes Tool] Google Routes API call error: {e}")

    # Fallback to geographic calculation
    total_dist = haversine_distance_meters(o_lat, o_lon, d_lat, d_lon)
    for inter in intermediates:
        if inter.get("latitude") and inter.get("longitude"):
            total_dist += haversine_distance_meters(o_lat, o_lon, inter["latitude"], inter["longitude"]) * 0.5

    # Estimated driving speed ~40 km/h in urban/suburban
    speed_mps = 11.1
    duration_secs = int(total_dist / speed_mps)
    duration_mins = max(5, duration_secs // 60)

    return {
        "success": True,
        "distance_meters": int(total_dist),
        "duration": f"{duration_mins} mins",
        "static_duration": f"{duration_mins} mins",
        "optimized_waypoint_order": list(range(len(intermediates))),
        "legs": [
            {
                "distanceMeters": int(total_dist),
                "duration": f"{duration_secs}s"
            }
        ]
    }