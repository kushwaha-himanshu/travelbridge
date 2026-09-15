import os
import requests
from dotenv import load_dotenv

load_dotenv()

GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

URL = "https://places.googleapis.com/v1/places:searchText"


def search_places(
    destination: str,
    interest: str,
    limit: int = 5
):

    if not GOOGLE_PLACES_API_KEY:
        raise ValueError(
            "GOOGLE_PLACES_API_KEY is not configured"
        )

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

    response = requests.post(
        URL,
        headers=headers,
        json=body,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    places = []

    for place in data.get("places", []):

        display_name = place.get("displayName", {})

        location = place.get("location", {})

        places.append({
            "id": place.get("id"),

            "name": display_name.get("text"),

            "address": place.get(
                "formattedAddress"
            ),

            "location": {
                "latitude": location.get(
                    "latitude"
                ),
                "longitude": location.get(
                    "longitude"
                )
            },

            "rating": place.get("rating"),

            "user_rating_count": place.get(
                "userRatingCount"
            ),

            "types": place.get(
                "types",
                []
            ),

            "google_maps_url": place.get(
                "googleMapsUri"
            ),

            "interest": interest
        })

    return places

##################### search  restaurants ###################

def search_restaurants(
    destination: str,
    limit: int = 5
):

    if not GOOGLE_PLACES_API_KEY:
        raise ValueError(
            "GOOGLE_PLACES_API_KEY is not configured"
        )

    query = f"best restaurants in {destination}"

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

    response = requests.post(
        URL,
        headers=headers,
        json=body,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    restaurants = []

    for place in data.get("places", []):

        display_name = place.get(
            "displayName", {}
        )

        location = place.get(
            "location", {}
        )

        restaurants.append({
            "id": place.get("id"),

            "name": display_name.get("text"),

            "address": place.get(
                "formattedAddress"
            ),

            "location": {
                "latitude": location.get(
                    "latitude"
                ),
                "longitude": location.get(
                    "longitude"
                )
            },

            "rating": place.get("rating"),

            "user_rating_count": place.get(
                "userRatingCount"
            ),

            "types": place.get(
                "types",
                []
            ),

            "google_maps_url": place.get(
                "googleMapsUri"
            )
        })

    return restaurants