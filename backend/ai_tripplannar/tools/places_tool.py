import os
import requests
from typing import List, Dict, Any
from config import GOOGLE_PLACES_API_KEY

URL = "https://places.googleapis.com/v1/places:searchText"

def search_places(
    destination: str,
    interest: str = "sightseeing",
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Searches for tourist attractions matching interests using Google Places API v1.
    If the API key is not configured or fails, falls back gracefully.
    """
    if not GOOGLE_PLACES_API_KEY:
        print("[Places Tool] GOOGLE_PLACES_API_KEY not configured. Falling back to public geosearch.")
        return _public_places_fallback(destination, interest, limit)

    query = f"{interest} tourist attractions in {destination}"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": (
            "places.id,"
            "places.displayName,"
            "places.formattedAddress,"
            "places.location,"
            "places.rating,"
            "places.userRatingCount,"
            "places.types,"
            "places.googleMapsUri"
        )
    }
    body = {
        "textQuery": query,
        "maxResultCount": limit,
        "languageCode": "en"
    }

    try:
        response = requests.post(URL, headers=headers, json=body, timeout=15)
        response.raise_for_status()
        data = response.json()
        places = []

        for place in data.get("places", []):
            display_name = place.get("displayName", {})
            loc = place.get("location", {})
            places.append({
                "id": place.get("id"),
                "name": display_name.get("text", "Attraction"),
                "address": place.get("formattedAddress"),
                "location": {
                    "latitude": loc.get("latitude"),
                    "longitude": loc.get("longitude")
                },
                "rating": place.get("rating"),
                "user_rating_count": place.get("userRatingCount"),
                "types": place.get("types", []),
                "google_maps_url": place.get("googleMapsUri"),
                "interest": interest
            })

        return places
    except Exception as e:
        print(f"[Places Tool] Google Places API search error: {e}. Attempting fallback.")
        return _public_places_fallback(destination, interest, limit)


def search_restaurants(
    destination: str,
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Searches for dining establishments in destination using Google Places API v1.
    """
    if not GOOGLE_PLACES_API_KEY:
        print("[Places Tool] GOOGLE_PLACES_API_KEY not configured. Falling back to public dining search.")
        return _public_restaurants_fallback(destination, limit)

    query = f"best restaurants and culinary spots in {destination}"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": (
            "places.id,"
            "places.displayName,"
            "places.formattedAddress,"
            "places.location,"
            "places.rating,"
            "places.userRatingCount,"
            "places.types,"
            "places.googleMapsUri"
        )
    }
    body = {
        "textQuery": query,
        "maxResultCount": limit,
        "languageCode": "en"
    }

    try:
        response = requests.post(URL, headers=headers, json=body, timeout=15)
        response.raise_for_status()
        data = response.json()
        restaurants = []

        for place in data.get("places", []):
            display_name = place.get("displayName", {})
            loc = place.get("location", {})
            restaurants.append({
                "id": place.get("id"),
                "name": display_name.get("text", "Restaurant"),
                "address": place.get("formattedAddress"),
                "location": {
                    "latitude": loc.get("latitude"),
                    "longitude": loc.get("longitude")
                },
                "rating": place.get("rating"),
                "user_rating_count": place.get("userRatingCount"),
                "types": place.get("types", []),
                "google_maps_url": place.get("googleMapsUri"),
                "price_level": "$$"
            })

        return restaurants
    except Exception as e:
        print(f"[Places Tool] Google Restaurants API error: {e}. Attempting fallback.")
        return _public_restaurants_fallback(destination, limit)


def _public_places_fallback(destination: str, interest: str, limit: int) -> List[Dict[str, Any]]:
    """Free OpenStreetMap/Nominatim fallback to discover real landmarks."""
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {"User-Agent": "TravelBridge-Planner/1.0"}
        params = {
            "q": f"tourism attractions in {destination}",
            "format": "json",
            "limit": limit
        }
        res = requests.get(url, params=params, headers=headers, timeout=8)
        if res.status_code == 200:
            items = res.json()
            results = []
            for item in items:
                name = item.get("display_name", "").split(",")[0]
                results.append({
                    "id": str(item.get("place_id")),
                    "name": name or f"Sight in {destination}",
                    "address": item.get("display_name"),
                    "location": {
                        "latitude": float(item.get("lat")),
                        "longitude": float(item.get("lon"))
                    },
                    "rating": 4.5,
                    "user_rating_count": 120,
                    "types": [interest],
                    "google_maps_url": f"https://www.google.com/maps/search/?api=1&query={item.get('lat')},{item.get('lon')}",
                    "interest": interest
                })
            if results:
                return results
    except Exception as ex:
        print(f"[Places Fallback] Nominatim search error: {ex}")

    return []


def _public_restaurants_fallback(destination: str, limit: int) -> List[Dict[str, Any]]:
    """Free OpenStreetMap/Nominatim fallback to discover real restaurants."""
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {"User-Agent": "TravelBridge-Planner/1.0"}
        params = {
            "q": f"restaurants in {destination}",
            "format": "json",
            "limit": limit
        }
        res = requests.get(url, params=params, headers=headers, timeout=8)
        if res.status_code == 200:
            items = res.json()
            results = []
            for item in items:
                name = item.get("display_name", "").split(",")[0]
                results.append({
                    "id": str(item.get("place_id")),
                    "name": name or f"Local Eatery in {destination}",
                    "address": item.get("display_name"),
                    "location": {
                        "latitude": float(item.get("lat")),
                        "longitude": float(item.get("lon"))
                    },
                    "rating": 4.4,
                    "user_rating_count": 95,
                    "types": ["restaurant", "food"],
                    "google_maps_url": f"https://www.google.com/maps/search/?api=1&query={item.get('lat')},{item.get('lon')}",
                    "price_level": "$$"
                })
            if results:
                return results
    except Exception as ex:
        print(f"[Restaurants Fallback] Nominatim search error: {ex}")

    return []