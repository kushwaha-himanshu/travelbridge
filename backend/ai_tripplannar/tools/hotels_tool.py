import os
import requests
from typing import List, Dict, Any, Optional
from config import STAYING_API_KEY

BASE_URL = "https://api.stayingapi.com/v1/search"


def normalize_hotel(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalizes raw external hotel data (from StayingAPI, Booking, or fallback providers)
    into our application's agreed structured hotel model.
    """
    if not isinstance(raw, dict):
        return {
            "id": None,
            "name": "Hotel",
            "location": None,
            "price": None,
            "rating": 4.5,
            "platform": "Booking",
            "url": None,
            "booking_url": None,
        }

    # 1. Normalize Location
    raw_loc = raw.get("location")
    location_obj = None
    if isinstance(raw_loc, dict):
        lat = raw_loc.get("lat") if raw_loc.get("lat") is not None else raw_loc.get("latitude")
        lng = raw_loc.get("lng") if raw_loc.get("lng") is not None else raw_loc.get("longitude")
        location_obj = {
            "lat": float(lat) if lat is not None else None,
            "lng": float(lng) if lng is not None else None,
            "city": raw_loc.get("city"),
            "region": raw_loc.get("region"),
            "country": raw_loc.get("country"),
            "address": raw_loc.get("address") or raw_loc.get("formattedAddress") or raw_loc.get("name"),
        }
    elif isinstance(raw_loc, str) and raw_loc.strip():
        parts = [p.strip() for p in raw_loc.split(",") if p.strip()]
        location_obj = {
            "lat": None,
            "lng": None,
            "city": parts[0] if parts else raw_loc,
            "region": None,
            "country": parts[-1] if len(parts) > 1 else None,
            "address": raw_loc,
        }

    # 2. Normalize Price
    raw_price = raw.get("price")
    price_obj = None
    if isinstance(raw_price, dict):
        nightly = raw_price.get("nightly")
        if nightly is None:
            nightly = raw_price.get("nightlyPrice") or raw_price.get("amount")

        total = raw_price.get("total")
        if total is None:
            total = raw_price.get("totalPrice") or raw_price.get("total_price")

        fees = raw_price.get("fees") if isinstance(raw_price.get("fees"), dict) else {}
        taxes = fees.get("taxes") if fees else raw_price.get("taxes")

        booking_url = raw_price.get("url") or raw.get("url")
        listing_id = raw_price.get("listingId") or raw_price.get("listing_id") or raw.get("id")

        price_obj = {
            "platform": raw_price.get("platform") or raw.get("platform") or "booking",
            "listing_id": str(listing_id) if listing_id else None,
            "currency": raw_price.get("currency") or "EUR",
            "nightly": float(nightly) if nightly is not None else None,
            "total": float(total) if total is not None else None,
            "nights": int(raw_price["nights"]) if raw_price.get("nights") is not None else None,
            "taxes": float(taxes) if taxes is not None else None,
            "booking_url": booking_url,
            "fees": fees or None,
        }
    elif isinstance(raw_price, (int, float)):
        val = float(raw_price)
        price_obj = {
            "platform": raw.get("platform") or "booking",
            "listing_id": str(raw.get("id") or ""),
            "currency": "EUR",
            "nightly": val,
            "total": val,
            "nights": 1,
            "taxes": None,
            "booking_url": raw.get("url"),
            "fees": None,
        }

    url = raw.get("url") or (price_obj.get("booking_url") if price_obj else None)
    listing_id = raw.get("id") or (price_obj.get("listing_id") if price_obj else None)

    return {
        "id": str(listing_id) if listing_id else None,
        "name": raw.get("name") or "Featured Hotel",
        "location": location_obj,
        "price": price_obj,
        "rating": float(raw.get("rating", 4.5)) if raw.get("rating") is not None else 4.5,
        "review_count": int(raw.get("review_count") or raw.get("reviewCount") or 0) if (raw.get("review_count") or raw.get("reviewCount")) else None,
        "platform": raw.get("platform") or (price_obj.get("platform") if price_obj else "Booking.com"),
        "url": url,
        "booking_url": url,
        "image_url": raw.get("image") or raw.get("image_url") or raw.get("photo"),
        "description": raw.get("description"),
    }


def search_hotels(
    destination: str,
    check_in: str = "",
    check_out: str = "",
    travelers: int = 2,
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Fetches real-time hotel options using StayingAPI or public accommodation search,
    passing all raw responses through the Hotel Normalizer.
    """
    if STAYING_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {STAYING_API_KEY}"
            }
            params = {
                "location": destination,
                "checkIn": check_in,
                "checkOut": check_out,
                "adults": travelers,
                "platforms": "booking",
                "limit": limit
            }
            response = requests.get(BASE_URL, headers=headers, params=params, timeout=15)
            if response.status_code == 200:
                data = response.json()
                raw_hotels = data.get("data", [])
                if raw_hotels:
                    return [normalize_hotel(h) for h in raw_hotels]
        except Exception as e:
            print(f"[Hotels Tool] StayingAPI request error: {e}")

    # Fallback to discover real accommodation via Nominatim
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {"User-Agent": "TravelBridge-Planner/1.0"}
        params = {
            "q": f"hotels in {destination}",
            "format": "json",
            "limit": limit
        }
        res = requests.get(url, params=params, headers=headers, timeout=8)
        if res.status_code == 200:
            items = res.json()
            results = []
            for idx, item in enumerate(items):
                name = item.get("display_name", "").split(",")[0]
                results.append(normalize_hotel({
                    "id": f"h-{item.get('place_id', idx)}",
                    "name": name or f"Hotel in {destination}",
                    "location": {
                        "lat": float(item.get("lat")),
                        "lng": float(item.get("lon")),
                        "address": item.get("display_name"),
                        "city": destination.split(",")[0].strip(),
                    },
                    "price": None,
                    "rating": 4.5,
                    "platform": "Direct / Booking",
                    "url": f"https://www.google.com/maps/search/?api=1&query={item.get('lat')},{item.get('lon')}"
                }))
            if results:
                return results
    except Exception as ex:
        print(f"[Hotels Fallback] Error: {ex}")

    return []