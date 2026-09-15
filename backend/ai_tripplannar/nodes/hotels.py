from graph.state import TripState
from tools.hotels_tool import search_hotels, normalize_hotel

def hotel_research(state: TripState):
    print("===== [NODE] HOTEL RESEARCH =====")
    destination = state.get("destination", "")
    travelers = state.get("travelers", 2)
    check_in = state.get("check_in", "")
    check_out = state.get("check_out", "")

    warnings = []
    if not check_in or not check_out:
        warnings.append("Specific check-in/out dates were not provided; standard availability assumed.")

    try:
        hotels = search_hotels(
            destination=destination,
            check_in=check_in,
            check_out=check_out,
            travelers=travelers,
            limit=5
        )
        normalized_hotels = []
        for h in (hotels or []):
            try:
                normalized_hotels.append(normalize_hotel(h))
            except Exception as norm_err:
                print(f"[Hotels] Normalization error for hotel: {norm_err}")
                continue

        print(f"[Hotels] Successfully retrieved and normalized {len(normalized_hotels)} accommodation options")
        return {
            "hotels": normalized_hotels,
            "warnings": warnings if warnings else []
        }
    except Exception as e:
        print(f"[Hotels] Search error: {e}")
        warnings.append("Hotel information is temporarily unavailable.")
        return {
            "hotels": [],
            "warnings": warnings
        }
