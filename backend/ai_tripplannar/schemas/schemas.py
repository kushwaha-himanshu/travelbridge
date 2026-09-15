from pydantic import BaseModel, Field
from typing import List, Optional


class TripPlanRequest(BaseModel):

    destination: str

    days: int

    travelers: int

    budget: float

    currency: str = "INR"

    interests: List[str] = Field(default_factory=list)

    travel_style: Optional[str] = None

    check_in: str

    check_out: str