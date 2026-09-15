from graph.state import TripState

def validate_trip(state: TripState):

    errors=[]

    destination = state.get("destination")
    days = state.get("days")
    travelers = state.get("travelers")
    budget = state.get("budget_breakdown", {}).get("total_budget")

    itinerary = state.get("itinerary", [])
    budget_breakdown = state.get("budget_breakdown", {})

    # Basic input validation

    if not destination:
        errors.append("Destination is missing.")

    if not days or days <= 0:
        errors.append("Number of days must be greater than 0.")

    if not travelers or travelers <= 0:
        errors.append("Number of travelers must be greater than 0.")

    if budget is not None and budget < 0:
        errors.append("Budget cannot be negative.")

    # Check generated results
    if not itinerary:
        errors.append("Itinerary was not generated.")

    if not budget_breakdown:
        errors.append("Budget information was not generated.")

    is_valid = len(errors) == 0

    print("\n===== VALIDATION =====")
    print("Valid:", is_valid)

    if errors:
        print("Errors:", errors)

    return {
        "validation_errors": errors,
        "is_valid": is_valid
    }