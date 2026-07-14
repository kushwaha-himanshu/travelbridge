import {plannerAgent,toolNode,shouldContinue} from "./planner.js"
import { StateGraph, START,END } from "@langchain/langgraph";
 import { HumanMessage } from "@langchain/core/messages";
 import { TripState } from "./state.js";
const graph = new StateGraph(TripState)

  // Nodes
  .addNode("planner", plannerAgent)
  .addNode("toolNode", toolNode)

  // Entry
  .addEdge(START, "planner")

  // Decide whether to execute tools
  .addConditionalEdges(
    "planner",
    shouldContinue,
    {
      toolNode: "toolNode",
      [END]: END,
    }
  )

  // After executing tools, ask the LLM again
  .addEdge("toolNode", "planner");


  export {graph};
//invoke the graph with a starting state
//  const app=graph.compile();
// const result = await app.invoke({
     
//   messages: [new HumanMessage(
//       "Plan a 3-day trip from Delhi to Jaipur. Tell me the weather, distance, and tourist attractions."
//     ),],
// });

// for (const message of result.messages) {
//   console.log(`[${message.type}]: ${message.content}`);
// }
