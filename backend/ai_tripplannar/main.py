import os
import traceback
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from graph.graph import trip_graph
from schemas.trip_schemas import (
    TripPlanRequest,
    TripPlanResponse,
    TripRefineRequest,
    TripRefineResponse
)
from nodes.trip_refine import refine_trip_plan

app = FastAPI(
    title="TravelBridge AI Trip Planner Service",
    version="1.0.0",
    description="LangGraph-powered AI Travel Planning & Refinement Microservice"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler for consistent error format
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[AI Service Error] Unhandled exception: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "TRIP_GENERATION_FAILED",
                "message": str(exc)
            }
        }
    )

@app.get("/")
def root():
    return {
        "service": "TravelBridge AI Trip Planner",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "TravelBridge AI Trip Planner",
        "version": "1.0.0"
    }

@app.get("/ready")
def ready_check():
    return {
        "status": "ready"
    }


# ==========================================
# TRIP PLANNING ENDPOINT
# ==========================================
@app.post(
    "/api/v1/trips/plan",
    response_model=TripPlanResponse,
    status_code=status.HTTP_200_OK
)
def plan_trip(request: TripPlanRequest):
    print("\n==========================================")
    print(f"[AI Service] Plan request for destination: '{request.destination}', {request.days} days")
    print("==========================================")

    initial_state = request.model_dump()
    result = trip_graph.invoke(initial_state)

    final_plan = result.get("final_plan")
    if not final_plan:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Graph execution finished without generating a final_plan."
        )

    return {
        "success": True,
        "data": final_plan
    }

# Backward compatibility alias
@app.post("/generate_trip")
def generate_trip_legacy(request: TripPlanRequest):
    result = plan_trip(request)
    return {
        "success": True,
        "plan": result["data"]
    }


# ==========================================
# TRIP REFINEMENT / RECHAT ENDPOINT
# ==========================================
@app.post(
    "/api/v1/trips/refine",
    response_model=TripRefineResponse,
    status_code=status.HTTP_200_OK
)
def refine_trip(request: TripRefineRequest):
    print("\n==========================================")
    print(f"[AI Service] Refine request: '{request.message}'")
    print("==========================================")

    if not request.current_trip:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="current_trip data is required for refinement."
        )

    refine_result = refine_trip_plan(
        current_trip=request.current_trip,
        message=request.message
    )

    return {
        "success": True,
        "message": refine_result["message"],
        "data": {
            "updated_trip": refine_result["updated_trip"],
            "changes": refine_result["changes"]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)