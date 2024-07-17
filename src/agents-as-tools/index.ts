import * as dotenv from "dotenv";

import { createCli } from "./create-cli";
import { createCoderAgent } from "./coder.agent";
import { createSendMessageToCoderTool } from "./coder.tool";
import { createSupervisorAgent } from "./planner.agent";

dotenv.config({ path: ".env" });

const main = async () => {
  const workerAgent = await createCoderAgent();
  const messageWorkerTool = createSendMessageToCoderTool(workerAgent);
  const supervisorAgent = await createSupervisorAgent(messageWorkerTool);

  await createCli(async (input) => {
    const result = await supervisorAgent.invoke(input);
    return result.output;
  });
};

main();
