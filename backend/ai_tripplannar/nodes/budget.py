import json

from graph.state import TripState
from llm.model import llm


def calculate_budget(state: TripState):

    print("===== BUDGET =====")

    itinerary = state.get("itinerary", [])

    if not itinerary:
        return {
            "budget_breakdown": {},
            "warnings": [
                "Cannot calculate budget because itinerary was not generated."
            ]
        }

    prompt = f"""
You are a travel budget planner.

Create a realistic DAY-WISE budget for this trip.

Destination: {state["destination"]}
Days: {state["days"]}
Travelers: {state["travelers"]}
Maximum Budget: {state["budget"]}
Currency: {state["currency"]}

Itinerary:
{json.dumps(itinerary, indent=2)}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "daily_budget": [
        {{
            "day": 1,
            "accommodation": 0,
            "food": 0,
            "transport": 0,
            "activities": 0,
            "miscellaneous": 0,
            "day_total": 0
        }}
    ],
    "total_budget": 0
}}

Rules:

- Create exactly {state["days"]} days.
- All values must be numbers.
- day_total =
  accommodation + food + transport + activities + miscellaneous.
- total_budget must equal the sum of all day_total values.
- total_budget must NOT exceed {state["budget"]}.
- Distribute the budget across the individual days.
- Do NOT put the entire budget on one day.
- Consider the actual activities and itinerary for each day.
- Do not return Markdown.
- Do not return explanations.
- Return ONLY JSON.
"""

    response = llm.invoke(prompt)

    content = response.content

    if isinstance(content, list):
        content = "".join(
            item["text"]
            for item in content
            if isinstance(item, dict)
            and item.get("type") == "text"
        )

    content = content.strip()

    if content.startswith("```json"):
        content = content[7:]

    if content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    budget_data = json.loads(content)

    print("===== BUDGET RESULT =====")
    print(json.dumps(budget_data, indent=2))

    return {
        "budget_breakdown": budget_data
    }