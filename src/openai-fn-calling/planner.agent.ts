import OpenAI from "openai"
import { Agent, AgentRole } from "./agent"
import { createRunShellCommandTool } from "./run-shell-command.tool"
import { createSendMessageTool } from "./send-message.tool"

export const createPlannerAgent = async (coderAgent: Agent): Promise<Agent> => {
  const openai = new OpenAI()
  const role = AgentRole.TechnicalProjectManager
  const sendMessageToCoderTool = createSendMessageTool(coderAgent)
  const systemprompt = [
    `You are a ${AgentRole.TechnicalProjectManager}. You manage a ${coderAgent.role} and you answer to the user.`,
    `Your role is to understand the user's needs and translate them into tasks that the ${coderAgent.role} can complete. The ${coderAgent.role} is knowledgable, but prone to lying and making mistakes. Check their work and guide them to success.`,
    `You have READ-ONLY access to the project directory, while the ${coderAgent.role} has FULL access.`,
    `Don't ask the user what they want to do next.`,
  ].join("\n\n")
  const tools = [
    createRunShellCommandTool("planner-agent"),
    sendMessageToCoderTool,
  ]

  return new Agent(openai, role, systemprompt, tools)
}
