import { DynamicTool } from "langchain/tools";

import { Role } from "./roles";
import { MyAgent } from "./types";

export const TOOL_NAME = `sendMessageTo${Role.JuniorProgrammer}`;

export const createSendMessageToCoderTool = (agent: MyAgent): DynamicTool => {
  const tool = new DynamicTool({
    name: TOOL_NAME,
    description: [
      `Use this tool to communicate with the ${Role.JuniorProgrammer}.`,
      `The tool returns the ${Role.JuniorProgrammer}'s response.`,
    ].join("\n"),
    func: async (query) => {
      console.log(`${TOOL_NAME} invoked with "${query}"`);
      const result = await agent.invoke(query);
      console.log(`${TOOL_NAME} returned ${result.output}`);
      console.log("-".repeat(80));
      return result.output;
    },
  });

  return tool;
};
