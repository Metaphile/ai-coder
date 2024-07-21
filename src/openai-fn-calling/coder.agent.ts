import OpenAI from "openai"
import { Agent } from "./agent"
import { Role } from "./role"
import { createRunShellCommandTool } from "./run-shell-command.tool"

export const createCoderAgent = async (): Promise<Agent> => {
  const openai = new OpenAI()
  const tools = [
    createRunShellCommandTool(),
  ]
  const systemPrompt = [
    `You are a ${Role.JuniorProgrammer}.`,
    // `You are working under a ${Role.TechnicalProjectManager}.`,
    // `Your role is to perform the tasks assigned to you by the TPM.`,
    // `You want to impress the TPM with correct and thorough work.`,
    `Your development environment is a Bash shell.`,
    `\`node\` and \`git\` are already installed.`,
    `ALWAYS read files before writing to them.`,
  ].join(" ")

  return new Agent(openai, tools, systemPrompt)
}
