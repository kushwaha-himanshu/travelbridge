from typing import TypedDict, List, Optional, Any, Dict

class TripState(TypedDict, total=False):
    # User Request Input
    destination: str
    days: int
    travelers: int
    budget: float
    currency: str
    interests: List[str]
    travel_style: Optional[str]
    check_in: Optional[str]
    check_out: Optional[str]
    starting_location: Optional[str]
    dietary_preferences: Optional[List[str]]

    # Geocoding & Research
    destination_info: Dict[str, Any]
    hotels: List[Dict[str, Any]]
    activities: List[Dict[str, Any]]
    restaurants: List[Dict[str, Any]]
    weather: List[Dict[str, Any]]

    # Itinerary & Math
    itinerary: List[Dict[str, Any]]
    budget_breakdown: Dict[str, Any]

    # Mobility & Routing
    transport_options: List[Dict[str, Any]]
    optimized_routes: List[Dict[str, Any]]

    # Quality & Advisory
    validation_errors: List[str]
    is_valid: bool
    tips: List[str]
    warnings: List[str]

    # Unified Final Response
    final_plan: Dict[str, Any]