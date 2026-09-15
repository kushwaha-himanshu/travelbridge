from typing import TypedDict, List, Optional, Any, Dict


class TripState(TypedDict, total=False):

    # =========================
    # USER INPUT
    # =========================

    user_request: str

    destination: str
    days: int
    travelers: int
    budget: float
    currency: str

    check_in: str
    check_out: str

    interests: List[str]
    travel_style: Optional[str]


    # =========================
    # RESEARCH DATA
    # =========================

    destination_info: Dict[str, Any]

    hotels: List[Dict[str, Any]]

    activities: List[Dict[str, Any]]

    restaurants: List[Dict[str, Any]]

   

    weather: List[Dict[str, Any]]


    # =========================
    # GENERATED PLAN
    # =========================

    budget_breakdown: Dict[str, Any]

    itinerary: List[Dict[str, Any]]

    

    tips: List[str]

    warnings: List[str]


    # =========================
    # ROUTE OPTIMIZATION
    # =========================

    transport_options: List[Dict[str, Any]]
    optimized_routes: List[Dict[str, Any]]


    # =========================
    # VALIDATION
    # =========================

    validation_errors: List[str]

    is_valid: bool


    # =========================
    # FINAL RESPONSE
    # =========================

    final_plan: Dict[str, Any]