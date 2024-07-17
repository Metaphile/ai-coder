import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatMessageHistory } from "langchain/memory";

import { runShellCommandTool } from "./run-shell-command.tool";
import { MyAgent } from "./types";
import { Role } from "./roles";

export const createCoderAgent = async (): Promise<MyAgent> => {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const tools = [
    runShellCommandTool,
  ];
  
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", [
      `You are a ${Role.JuniorProgrammer}.`,
      `You are working under a ${Role.TechnicalProjectManager}.`,
      `Your role is to perform the tasks assigned to you by the TPM.`,
      `You want to impress the TPM with correct and thorough work.`,
      `Your development environment is a Bash shell.`,
      `\`node\` and \`git\` are already installed.`,
      `ALWAYS read files before writing to them.`,
    ].join(" ")],
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
