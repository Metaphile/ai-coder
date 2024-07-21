import OpenAI from "openai"
import { Tool } from "./tool"

type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam
type OpenAIToolCall = OpenAI.Chat.Completions.ChatCompletionMessageToolCall

export class Agent {
  private readonly MAX_ITERATIONS = 50
  private readonly MAX_MESSAGES = 50
  private toolMap: Record<string, Tool>

  constructor(
    private readonly openai: OpenAI,
    private readonly tools: Tool[],
    private readonly systemPrompt: string,
    private messages: OpenAIMessage[] = [],
  ) {
    this.toolMap = tools.reduce((map, tool) => ({
      ...map,
      [tool.function.name]: tool,
    }), {})
  }

  public async invoke(input: string): Promise<OpenAIMessage> {
    this.pushMessages({ role: "user", content: input, name: "human" })

    for (let i = 0; i < this.MAX_ITERATIONS; i++) {
      const result = await this.openai.chat.completions.create({
        messages: [
          { role: "system", content: this.systemPrompt },
          ...this.messages,
        ],
        model: "gpt-4o",
        tools: this.tools,
      })

      const { message } = result.choices?.[0]
      this.pushMessages(message)

      if (message.tool_calls) {
        this.pushMessages(...await this.handleToolCalls(message.tool_calls))
        continue
      }

      return this.messages[this.messages.length - 1]
    }

    this.pushMessages({
      role: "system",
      content: `Error: Too many consecutive tool calls. The limit is ${this.MAX_ITERATIONS}.`,
    })

    return this.messages[this.messages.length - 1]
  }

  private async handleToolCalls(toolCalls: OpenAIToolCall[]): Promise<OpenAIMessage[]> {
    const messages: OpenAIMessage[][] = await Promise.all(toolCalls.map(async (toolCall) => {
      const tool = this.toolMap[toolCall.function.name]

      try {
        const toolArgs = tool.schema.parse(
          JSON.parse(toolCall.function.arguments),
        )
        return await tool.invoke(toolCall.id, toolArgs)
      } catch (err) {
        return [{
          role: "tool" as const,
          tool_call_id: toolCall.id,
          content: err instanceof Error ? err.message : "Error: Unknown error."
        }]
      }
    }))

    return messages.flat()
  }

  private pushMessages(...messages: OpenAIMessage[]): void {
    this.messages.push(...messages)
    // limit to the N most recent messages
    this.messages = this.messages.slice(
      Math.max(this.messages.length - this.MAX_MESSAGES, 0)
    )

    // Tool messages must be preceded by a tool call.
    // If there are tool messages at the beginning of the truncated message history, remove them.
    while (this.messages?.[0].role === "tool") {
      this.messages.unshift()
    }
  }
}
