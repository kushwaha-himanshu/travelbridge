from graph.state import TripState
from typing import List

def validate_trip(state: TripState):
    print("===== [NODE] VALIDATE TRIP =====")
    errors: List[str] = []
    
    destination = state.get("destination")
    days = state.get("days", 0)
    travelers = state.get("travelers", 0)
    itinerary = state.get("itinerary", [])
    budget_breakdown = state.get("budget_breakdown", {})

    if not destination:
        errors.append("Destination is missing.")
    if days <= 0:
        errors.append("Duration must be at least 1 day.")
    if travelers <= 0:
        errors.append("Travelers must be at least 1.")
    if not itinerary:
        errors.append("Itinerary days could not be generated.")
    if not budget_breakdown:
        errors.append("Budget breakdown was not calculated.")

    is_valid = len(errors) == 0
    print(f"[Validate Trip] Status: {'Valid' if is_valid else 'Issues found'}, Errors: {errors}")

    return {
        "validation_errors": errors,
        "is_valid": is_valid
    }