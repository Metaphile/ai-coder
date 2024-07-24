import OpenAI from "openai"
import { Agent, AgentRole } from "./agent"
import { createRunShellCommandTool } from "../tools/run-shell-command.tool"

export const createCoderAgent = async (): Promise<Agent> => {
  const openai = new OpenAI()
  const tools = [
    createRunShellCommandTool("coder-agent"),
  ]
  const role = AgentRole.JuniorProgrammer
  const systemPrompt = [
    `You are a ${role}.`,
    `You are working under a ${AgentRole.TechnicalProjectManager}.`,
    `Your role is to perform the tasks assigned to you by the TPM.`,
    `Your development environment is a Bash shell.`,
    `\`node\` and \`git\` are already installed.`,
    `ALWAYS read files before writing to them.`,
  ].join(" ")

  return new Agent(openai, role, systemPrompt, tools)
}
