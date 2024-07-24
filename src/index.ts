import * as dotenv from "dotenv"
import { createCli } from "./utils/create-cli"
import { createCoderAgent } from "./agents/coder.agent"
import { createPlannerAgent } from "./agents/planner.agent"

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
