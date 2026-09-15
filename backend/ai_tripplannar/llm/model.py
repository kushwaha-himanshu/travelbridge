import os
import json
from config import GEMINI_API_KEY
from langchain_core.messages import AIMessage

class MockGeminiLLM:
    """Fallback LLM used when GEMINI_API_KEY is not configured or offline."""
    def invoke(self, prompt, **kwargs):
        prompt_str = str(prompt)
        print("[MockLLM] Invoked with prompt snippet:", prompt_str[:120].replace("\n", " "))
        
        # If prompt is asking for itinerary JSON:
        if "itinerary" in prompt_str.lower() and "json" in prompt_str.lower():
            mock_itinerary = {
                "itinerary": [
                    {
                        "day": 1,
                        "title": "Arrival & Historic Exploration",
                        "description": "Welcome and orientation tour of the iconic landmarks.",
                        "location": "City Center & Old Town",
                        "activities": [
                            {
                                "name": "Historic City Center Orientation",
                                "start_time": "09:30",
                                "end_time": "12:00",
                                "duration_minutes": 150,
                                "location": "Central Square",
                                "description": "Guided walking tour through historic quarters and architectural landmarks.",
                                "category": "culture"
                            },
                            {
                                "name": "Traditional Cuisine & Culinary Tasting",
                                "start_time": "12:30",
                                "end_time": "14:00",
                                "duration_minutes": 90,
                                "location": "Old Market Street",
                                "description": "Sampling renowned local delicacies and street specialties.",
                                "category": "food"
                            },
                            {
                                "name": "Scenic Viewpoint & Sunset Trail",
                                "start_time": "16:00",
                                "end_time": "18:30",
                                "duration_minutes": 150,
                                "location": "Panorama Ridge",
                                "description": "Leisurely afternoon stroll with panoramic photography vantage points.",
                                "category": "nature"
                            }
                        ]
                    }
                ]
            }
            return AIMessage(content=json.dumps(mock_itinerary))
            
        # If prompt is asking for research:
        if "travel researcher" in prompt_str.lower() or "travel information" in prompt_str.lower():
            return AIMessage(content="""
1. Important places to visit: Historic Old Town, Central Promenade, Panoramic Viewpoint, Cultural Heritage Museum.
2. Recommended activities: Walking heritage tour, local craft market exploration, scenic sunset walk.
3. Best areas/locations to explore: City Center, Riverside District, Mountain/Coastal Trail.
4. Suggested local experiences: Authentic street tasting, traditional tea or coffee break, evening promenade.
5. General travel tips: Carry comfortable walking shoes, obtain a local transit day pass, reserve popular viewpoints in advance.
""")

        # Generic response
        return AIMessage(content="Generated structured travel insights.")

    def with_structured_output(self, schema):
        # Return self or wrapper that returns dummy schema instance
        class StructuredWrapper:
            def __init__(self, fallback_schema):
                self.schema = fallback_schema
            def invoke(self, prompt, **kwargs):
                return self.schema()
        return StructuredWrapper(schema)

# Initialize Real or Fallback LLM
if GEMINI_API_KEY:
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        # Using stable gemini model
        llm = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash",
            temperature=0.2,
            google_api_key=GEMINI_API_KEY,
        )
        print("[LLM] Initialized ChatGoogleGenerativeAI with Gemini model")
    except Exception as e:
        print(f"[LLM] Failed to initialize ChatGoogleGenerativeAI: {e}. Using MockGeminiLLM.")
        llm = MockGeminiLLM()
else:
    print("[LLM] GEMINI_API_KEY not found. Using MockGeminiLLM for safe testing.")
    llm = MockGeminiLLM()
