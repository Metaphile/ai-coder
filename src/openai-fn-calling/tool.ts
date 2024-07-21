import OpenAI from "openai"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam
type OpenAITool = OpenAI.Chat.Completions.ChatCompletionTool

export type Tool = OpenAITool & {
  schema: z.ZodSchema
  invoke: (tool_call_id: string, ...args: any[]) => Promise<OpenAIMessage[]>
}

type CreateToolParams = Pick<Tool, "schema" | "invoke"> & {
  name: string
  description: string
}

export const createTool = ({ name, description, schema, invoke }: CreateToolParams): Tool => {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters: zodToJsonSchema(schema),
    },
    schema,
    invoke,
  }
}
