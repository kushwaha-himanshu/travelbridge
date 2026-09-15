# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# STAYINGAPI_KEY = os.getenv("STAYING_API_KEY")

# BASE_URL = "https://api.stayingapi.com/v1/search"


# def search_hotels(
#     destination: str,
#     check_in: str,
#     check_out: str,
#     travelers: int = 2,
#     limit: int = 5
# ):

#     if not STAYINGAPI_KEY:
#         raise ValueError("STAYING_API_KEY is missing from .env")

#     headers = {
#         "Authorization": f"Bearer {STAYINGAPI_KEY}"
#     }

#     params = {
#         "location": destination,
#         "checkIn": check_in,
#         "checkOut": check_out,
#         "adults": travelers,
#         "platforms": "booking",
#         "limit": limit
#     }

#     print("\n===== HOTEL API REQUEST =====")
#     print("URL:", BASE_URL)
#     print("PARAMS:", params)
#     print("API KEY EXISTS:", bool(STAYINGAPI_KEY))

#     response = requests.get(
#         BASE_URL,
#         headers=headers,
#         params=params,
#         timeout=30
#     )

#     print("STATUS CODE:", response.status_code)
#     print("RAW RESPONSE:")
#     print(response.text)

#     response.raise_for_status()

#     data = response.json()

#     hotels = []

#     for hotel in data.get("data", []):

#         hotels.append({
#             "id": hotel.get("id"),
#             "name": hotel.get("name"),
#             "location": hotel.get("location"),
#             "price": hotel.get("price"),
#             "rating": hotel.get("rating"),
#             "platform": hotel.get("platform"),
#             "url": hotel.get("url")
#         })

#     print("HOTELS EXTRACTED:", len(hotels))

#     return hotels





import os
import requests
from dotenv import load_dotenv

load_dotenv()

STAYINGAPI_KEY = os.getenv("STAYING_API_KEY")

BASE_URL = "https://api.stayingapi.com/v1/search"


def search_hotels(
    destination: str,
    check_in: str,
    check_out: str,
    travelers: int = 2,
    limit: int = 5
):

    if not STAYINGAPI_KEY:
        raise ValueError("STAYINGAPI_KEY is missing from .env")

    headers = {
        "Authorization": f"Bearer {STAYINGAPI_KEY}"
    }

    params = {
        "location": destination,
        "checkIn": check_in,
        "checkOut": check_out,
        "adults": travelers,
        "platforms": "booking",
        "limit": limit
    }


    print("\n===== HOTEL API REQUEST =====")
    print("URL:", BASE_URL)
    print("PARAMS:", params)
    print("API KEY EXISTS:", bool(STAYINGAPI_KEY))
    
    response = requests.get(
        BASE_URL,
        headers=headers,
        params=params,
        timeout=30
    )

    print("STATUS CODE:", response.status_code)
    print("RAW RESPONSE:")
    print(response.text)

    response.raise_for_status()

    data = response.json()

    hotels = []

    for hotel in data.get("data", []):

        hotels.append({
            "id": hotel.get("id"),
            "name": hotel.get("name"),
            "location": hotel.get("location"),
            "price": hotel.get("price"),
            "rating": hotel.get("rating"),
            "platform": hotel.get("platform"),
            "url": hotel.get("url")
        })
        print("HOTELS EXTRACTED:", len(hotels))

    return hotels    