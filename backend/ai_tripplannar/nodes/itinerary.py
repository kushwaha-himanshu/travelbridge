from llm.model import llm
from graph.state import TripState
import json


def trip_itinerary(state: TripState):

    print("===== ITINERARY GENERATION =====")

    destination = state["destination"]
    days = state["days"]
    travelers = state["travelers"]
    interests = state["interests"]
    travel_style = state.get("travel_style", "moderate")

    research = state.get(
        "destination_info", {}
    ).get("research", "")

    activities = state.get("activities", [])
    restaurants = state.get("restaurants", [])
    weather = state.get("weather", [])

    prompt = f"""
You are an expert travel itinerary planner.

Create a practical {days}-day itinerary for:

Destination: {destination}
Travelers: {travelers}
Interests: {interests}
Travel style: {travel_style}

Travel research:
{research}

Available activities:
{activities}

Available restaurants:
{restaurants}

Weather information:
{weather}

Create a realistic day-by-day itinerary.

Important requirements:

- Create exactly {days} days.
- Do not overload the day.
- Group nearby places together.
- Consider realistic travel time.
- Match the user's interests.
- Consider the weather.
- Do not include hotel information.
- Do not calculate the final budget.
- Use realistic start and end times.
- Leave reasonable gaps between activities for travel.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "itinerary": [
        {{
            "day": 1,
            "title": "Day title",
            "description": "Short description of the day",
            "location": "Main area/location",

            "activities": [
                {{
                    "name": "Activity name",
                    "start_time": "09:00",
                    "end_time": "11:00",
                    "location": "Activity location",
                    "description": "Short description"
                }},

                {{
                    "name": "Activity name",
                    "start_time": "11:30",
                    "end_time": "13:00",
                    "location": "Activity location",
                    "description": "Short description"
                }},

                {{
                    "name": "Activity name",
                    "start_time": "17:00",
                    "end_time": "19:00",
                    "location": "Activity location",
                    "description": "Short description"
                }}
            ]
        }}
    ]
}}

Rules:

Important:

- Create exactly the requested number of days.
- Each day should contain 2-4 activities.
- Each activity MUST be an object.
- Each activity MUST contain name, start_time, end_time and description.
- start_time and end_time MUST use HH:MM format.
- Activities must be in chronological order.
- Do not create overlapping activities.
- Leave realistic time between activities for travel.
- Do not include hotel information.
- Do not calculate budget.
- Return ONLY valid JSON.
"""

    response = llm.invoke(prompt)

    print("===== RAW ITINERARY RESPONSE =====")
    print(response.content)

    content = response.content

    # Gemini may return a list
    if isinstance(content, list):

        content = "".join(
            item.get("text", "")
            for item in content
            if isinstance(item, dict)
        )

    content = content.strip()

    # Remove accidental Markdown fences
    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    # Convert JSON string to Python dictionary
    itinerary_data = json.loads(content)

    print("===== STRUCTURED ITINERARY =====")
    print(json.dumps(
        itinerary_data,
        indent=2,
        ensure_ascii=False
    ))

    return {
        "itinerary": itinerary_data["itinerary"]
    }