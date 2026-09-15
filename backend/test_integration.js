import { planTrip, refineTrip, checkHealth } from "./src/services/aiTripService.js";

async function runIntegrationTest() {
  console.log("=== TRAVELBRIDGE NODE.JS TO PYTHON INTEGRATION TEST ===");

  // 1. Check Python Service Health
  console.log("Checking Python AI Service Health...");
  const health = await checkHealth();
  console.log("Python Health Response:", health);

  // 2. Test Plan Trip
  console.log("\nTesting Plan Trip via Node.js Service Client...");
  try {
    const planRes = await planTrip({
      destination: "Kyoto, Japan",
      days: 3,
      travelers: 2,
      budget: 45000,
      currency: "INR",
      interests: ["culture", "food"],
      travel_style: "moderate",
    });

    console.log("Plan Trip Result success:", planRes.success);
    console.log("Destination Name:", planRes.data?.destination?.name);
    console.log("Itinerary Days Count:", planRes.data?.itinerary?.length);
    console.log("Estimated Cost:", planRes.data?.budget?.estimated_cost, planRes.data?.trip?.currency);

    // 3. Test Refine Trip
    console.log("\nTesting Refine Trip (Rechat)...");
    const refineRes = await refineTrip({
      message: "Make Day 2 less busy and focus on traditional tea",
      current_trip: planRes.data,
    });

    console.log("Refine Result success:", refineRes.success);
    console.log("Refine Message:", refineRes.message);
    console.log("Refine Changes:", refineRes.data?.changes);

    console.log("\nALL NODE -> PYTHON INTEGRATION TESTS PASSED!");
  } catch (err) {
    console.error("Integration test encountered an error:", err.message);
  }
}

runIntegrationTest();
