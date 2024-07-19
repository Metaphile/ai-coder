import * as dotenv from "dotenv";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import OpenAI from "openai";

dotenv.config({ path: ".env" });

enum Recipient {
  Coder = "Coder",
  Researcher = "Researcher",
}

const sendMessageSchema = z.object({
  recipient: z.nativeEnum(Recipient),
  messsage: z.string(),
});

const toOpenaiFnDef = (name: string, description: string, schema: z.ZodSchema): any => {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters: zodToJsonSchema(schema),
    },
  };
};

const tools = [
  toOpenaiFnDef(
    "sendMessage",
    "Use this tool to send a message to another agent. Returns the agent's response.",
    sendMessageSchema,
  ),
];

const openai = new OpenAI();

const main = async () => {
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Send a test message to the ${Recipient.Coder} agent.` }],
    model: "gpt-4o",
    tools,
    tool_choice: "required",
  });

  try {
    const args = sendMessageSchema.parse(JSON.parse(response.choices[0].message.tool_calls?.[0].function.arguments || "{}"));

    // uncomment to see ZodError
    // const args = sendMessageSchema.parse({ recipient: "Joe" });

    console.log(JSON.stringify(args, null, 2));
  } catch (err) {
    console.log(err);
  }
};

main();
