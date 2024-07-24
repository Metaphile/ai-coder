import { z } from "zod"
import { createTool } from "./tool"
import { Agent } from "../agents/agent"

export const createSendMessageTool = (agent: Agent) => {
  const name = `sendMessageTo${agent.role}`
  const description = `Sends a message to ${agent.role} and returns their response.`
  const schema = z.object({
    message: z.string(),
  })
  const invoke = async (tool_call_id: string, { message }: z.infer<typeof schema>) => {
    console.log(`Message to ${agent.role}: ${message}`)
    const { content } = await agent.invoke(message)
    console.log(`Message from ${agent.role}: ${content}`)
    return [{
      role: "tool" as const,
      tool_call_id,
      content: String(content),
      name,
    }]
  }

  return createTool({
    name,
    description,
    schema,
    invoke,
  })
}
