import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatMessageHistory } from "langchain/memory";
import { DynamicTool } from "langchain/tools";

import { runShellCommandTool } from "./run-shell-command.tool";
import { Role } from "./roles";
import { MyAgent } from "./types";
import { TOOL_NAME as CODER_TOOL_NAME } from "./coder.tool";

export const createSupervisorAgent = async (messageJuniorProgrammerTool: DynamicTool): Promise<MyAgent> => {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
  });

  const tools = [
    runShellCommandTool,
    messageJuniorProgrammerTool,
  ];
  
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", [
      `You are a ${Role.TechnicalProjectManager}.`,
      `Your role is to answer technical questions and delegate programming tasks to a ${Role.JuniorProgrammer}`,
      `Delegate tasks by passing instructions to the ${CODER_TOOL_NAME}.`,
      `Use \`curl\`, \`man\`, or other Bash commands to look up needed information.`,
      // `You have READ-ONLY access to a shared project directory.`,
      // `The ${Role.JuniorProgrammer} has FULL access to the shared project directory.`,
    ].join("\n")],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);
  
  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt,
  });
  
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  let messageHistory = new ChatMessageHistory();
  const maxMessages = 20;
  const statefulAgent = new RunnableWithMessageHistory({
    runnable: agentExecutor,
    // we must accept a session ID but we don't need it
    getMessageHistory: async (_sessionId) => {
      const buffer = await messageHistory.getMessages();
      const window = buffer.slice(-maxMessages);
      messageHistory = new ChatMessageHistory(window);
      return messageHistory;
    },
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  return {
    invoke: async (input) => {
      const result = await statefulAgent.invoke(
        { input },
        // we must specify a session ID even though we don't need it
        { configurable: { sessionId: "foo" } },
      );
      return result;
    },
  };
};
