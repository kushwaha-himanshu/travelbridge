import json
import re
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from llm.model import llm
from graph.state import TripState

class ActivitySchema(BaseModel):
    name: str = Field(..., description="Name of the activity")
    start_time: str = Field(..., description="HH:MM format, e.g. 09:30")
    end_time: str = Field(..., description="HH:MM format, e.g. 11:30")
    duration_minutes: int = Field(default=90, description="Duration in minutes")
    location: str = Field(..., description="Location or area name")
    description: str = Field(..., description="Engaging description of activity")
    category: str = Field(default="sightseeing", description="Category: culture, food, nature, adventure, shopping, relaxation")

class DaySchema(BaseModel):
    day: int = Field(..., description="Day number (1, 2, ...)")
    title: str = Field(..., description="Thematic title for the day")
    description: str = Field(..., description="Short overview of the day")
    location: str = Field(..., description="Primary district or zone")
    activities: List[ActivitySchema] = Field(..., description="Chronological activities for the day")

class ItineraryOutputSchema(BaseModel):
    itinerary: List[DaySchema] = Field(..., description="Full day-by-day itinerary")


def trip_itinerary(state: TripState):
    print("===== [NODE] ITINERARY GENERATION (STRUCTURED) =====")
    destination = state.get("destination", "")
    days = state.get("days", 3)
    travelers = state.get("travelers", 2)
    interests = state.get("interests", [])
    travel_style = state.get("travel_style", "moderate")

    activities = state.get("activities", [])
    restaurants = state.get("restaurants", [])
    weather = state.get("weather", [])
    destination_info = state.get("destination_info", {})

    prompt = f"""
You are an expert itinerary architect.
Create a realistic, balanced, day-by-day travel plan for:
- Destination: {destination}
- Total Days: {days} (Create exactly {days} day objects numbered 1 to {days})
- Travelers: {travelers}
- Style: {travel_style}
- Interests: {', '.join(interests) if interests else 'Culture, Sightseeing, Food'}

Attractions to draw from:
{[a.get('name') for a in activities[:8]]}

Dining to draw from:
{[r.get('name') for r in restaurants[:6]]}

Weather context:
{[w.get('condition') for w in weather[:days]]}

CRITICAL RULES:
1. Provide exactly {days} days.
2. Each day must feature 2 to 4 logically sequenced activities in chronological order.
3. Start times and end times MUST be in HH:MM format (24-hour).
4. Do not create overlapping activities; allow travel transition gaps.
5. Return ONLY a valid JSON object matching the requested schema:
{{
  "itinerary": [
    {{
      "day": 1,
      "title": "Day title",
      "description": "Short overview",
      "location": "District/Zone",
      "activities": [
        {{
          "name": "Activity Name",
          "start_time": "09:30",
          "end_time": "12:00",
          "duration_minutes": 150,
          "location": "Specific landmark",
          "description": "What to experience",
          "category": "culture"
        }}
      ]
    }}
  ]
}}
"""

    parsed_itinerary = None

    # 1. Try structured invocation if supported
    try:
        if hasattr(llm, "with_structured_output"):
            structured_llm = llm.with_structured_output(ItineraryOutputSchema)
            res = structured_llm.invoke(prompt)
            if isinstance(res, ItineraryOutputSchema) and res.itinerary:
                parsed_itinerary = res.model_dump()["itinerary"]
                print(f"[Itinerary] Structured output parsed {len(parsed_itinerary)} days successfully.")
    except Exception as ex:
        print(f"[Itinerary] Structured invoke fallback: {ex}")

    # 2. Fallback to direct prompt + Pydantic validation
    if not parsed_itinerary:
        try:
            response = llm.invoke(prompt)
            raw_text = response.content if hasattr(response, "content") else str(response)
            if isinstance(raw_text, list):
                raw_text = "".join(i.get("text", "") for i in raw_text if isinstance(i, dict))
            
            # Robust JSON extraction
            cleaned = str(raw_text).strip()
            # Extract JSON substring
            match = re.search(r"\{[\s\S]*\}", cleaned)
            if match:
                json_str = match.group(0)
                loaded_dict = json.loads(json_str)
                validated = ItineraryOutputSchema(**loaded_dict)
                parsed_itinerary = validated.model_dump()["itinerary"]
        except Exception as ex:
            print(f"[Itinerary] JSON parse/validation error: {ex}")

    # 3. Deterministic Safety Fallback (ensures pipeline NEVER breaks)
    if not parsed_itinerary or len(parsed_itinerary) < days:
        print("[Itinerary] Generating deterministic itinerary fallback.")
        parsed_itinerary = []
        themes = [
            ("Arrival & Historic Exploration", "City Center & Old Town"),
            ("Art, Heritage & Culinary Delights", "Cultural Quarter"),
            ("Nature Trails & Scenic Panoramic Views", "Scenic Outskirts"),
            ("Local Markets & Hidden Gems", "Market District"),
            ("Relaxation & Farewell Highlights", "Waterfront Promenade")
        ]
        
        for d in range(1, days + 1):
            theme_title, theme_loc = themes[(d - 1) % len(themes)]
            act1_name = activities[(d * 2 - 2) % len(activities)]["name"] if activities else f"Historic Landmark of {destination}"
            act2_name = restaurants[(d - 1) % len(restaurants)]["name"] if restaurants else f"Traditional Tasting in {destination}"
            act3_name = activities[(d * 2 - 1) % len(activities)]["name"] if activities else f"Scenic Promenade in {destination}"

            parsed_itinerary.append({
                "day": d,
                "title": f"Day {d}: {theme_title}",
                "description": f"Immerse in the prime highlights of {destination} with a comfortable, engaging schedule.",
                "location": theme_loc,
                "activities": [
                    {
                        "name": act1_name,
                        "start_time": "09:30",
                        "end_time": "12:00",
                        "duration_minutes": 150,
                        "location": theme_loc,
                        "description": f"Morning discovery and exploration of {act1_name}.",
                        "category": "culture"
                    },
                    {
                        "name": f"Lunch & Culinary Experience at {act2_name}",
                        "start_time": "12:30",
                        "end_time": "14:00",
                        "duration_minutes": 90,
                        "location": f"Culinary Lane, {destination}",
                        "description": "Enjoy regional specialties and relax during lunchtime.",
                        "category": "food"
                    },
                    {
                        "name": act3_name,
                        "start_time": "15:30",
                        "end_time": "18:00",
                        "duration_minutes": 150,
                        "location": destination,
                        "description": f"Afternoon visit and photography walk around {act3_name}.",
                        "category": "nature"
                    }
                ]
            })

    print(f"[Itinerary] Finalized {len(parsed_itinerary)} itinerary days.")
    return {"itinerary": parsed_itinerary}