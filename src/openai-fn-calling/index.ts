import * as dotenv from "dotenv"
import { createCli } from "../utils/create-cli"
import { createCoderAgent } from "./coder.agent"
import { createPlannerAgent } from "./planner.agent"

dotenv.config({ path: ".env" })

const main = async () => {
  const coderAgent = await createCoderAgent()
  const plannerAgent = await createPlannerAgent(coderAgent)

  createCli(async (input) => {
    const { content } = await plannerAgent.invoke(input)
    return content
  })
}

main()
