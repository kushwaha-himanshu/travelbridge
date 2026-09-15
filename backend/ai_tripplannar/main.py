from fastapi import FastAPI, HTTPException

from graph.graph import trip_graph
from schemas.schemas import TripPlanRequest


app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "TravelBridge AI service is running"
    }


@app.post("/generate_trip")
def generate_trip(request: TripPlanRequest):

    try:
        # Convert request model → dictionary
        initial_state = request.model_dump()

        print("===== TRIP REQUEST =====")
        print(initial_state)

        # Run LangGraph
        result = trip_graph.invoke(initial_state)

        print("===== GRAPH RESULT =====")
        print(result)

        # Make sure finalizer produced final_plan
        final_plan = result.get("final_plan")

        if final_plan is None:
            raise HTTPException(
                status_code=500,
                detail="Graph completed but final_plan was not generated."
            )

        return {
            "success": True,
            "plan": final_plan
        }

    except HTTPException:
        raise

    except Exception as e:
        print("===== GRAPH ERROR =====")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Trip generation failed: {str(e)}"
        )