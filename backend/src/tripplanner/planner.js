import { modelWithTools } from "./AI_model.js";
import { SystemMessage } from "@langchain/core/messages";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";
import { toolsByName } from "./Tools.js";
const plannerAgent = async (state) => {
  const response = await modelWithTools.invoke([
    new SystemMessage(
      "You are an AI Trip Planner. Use the available tools whenever needed."
    ),
    ...state.messages,
  ]);

  return {
    messages: [response],
    llmCalls:1,
  };
};

//define tool node
const toolNode = async (state) => {
  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return {
      messages: [],
    };
  }

  const result = [];

  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];

    if (!tool) {
      throw new Error(`Tool "${toolCall.name}" not found.`);
    }

    const observation = await tool.invoke(toolCall.args);

    result.push(
    new ToolMessage({
        content: JSON.stringify(observation),
        tool_call_id: toolCall.id,
    })
);
  }

  return {
    messages: result,
  };
};




//connecting toolnode and end  node
// const shouldContinue = (state) => {
//   const lastMessage = state.messages.at(-1);

//   // If there is no AIMessage, stop the graph
//   if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
//     return END;
//   }

//   // If the AI requested one or more tools,
//   // go to the Tool Node
//   if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
//     return "toolNode";
//   }

//   // Otherwise, the AI has produced the final answer
//   return END;
// };
const shouldContinue = (state) => {
  const lastMessage = state.messages.at(-1);

  console.log("Last Message:", lastMessage);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    console.log("Returning END");
    return END;
  }

  console.log("Tool Calls:", lastMessage.tool_calls);

  if (lastMessage.tool_calls?.length > 0) {
    console.log("Returning toolNode");
    return "toolNode";
  }

  console.log("Returning END");
  return END;
};

export {toolNode, plannerAgent, shouldContinue};