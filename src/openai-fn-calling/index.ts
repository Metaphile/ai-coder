import * as dotenv from "dotenv"
import { createCli } from "../utils/create-cli"
import { createCoderAgent } from "./coder.agent"

dotenv.config({ path: ".env" })

const main = async () => {
  const agent = await createCoderAgent()

  createCli(async (input) => {
    const { content } = await agent.invoke(input)
    return content
  })
}

main()
