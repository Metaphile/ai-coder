import { exec } from "node:child_process"
import { z } from "zod"
import { Tool, createTool } from "./tool"

type MyExecResult = {
  stdout: string
  stderr: string
  status: number
}

const myExec = async (user: string, command: string): Promise<MyExecResult> => {
  return new Promise((resolve) => {
    exec([
      `docker exec -i --user ${user} ai-coder-sandbox sh <<'SANDBOX'`,
      command,
      `SANDBOX`,
    ].join("\n"), (err, stdout, stderr) => {
      // console.log("Exec result: ", err, stdout, stderr)
      resolve({
        stdout,
        stderr,
        status: err ? 1 : 0,
      })
    })
  })
}

const formatResult = ({ stdout, stderr, status }: MyExecResult): string => {
  return JSON.stringify({
    status,
    stderr: limitLines(stderr),
    stdout: limitLines(stdout),
  }, null, 2)
}

// splitting on lines instead of characters/tokens is convenient
// but doesn't handle the case of one very long line
export const limitLines = (input: string, maxLines = 100): string => {
  if (!input) {
    return input
  }

  const lines = input.split("\n")
  // exclude trailing newline
  lines.pop()

  if (lines.length > maxLines) {
    const excessLines = lines.length - maxLines

    // strip lines from the middle
    lines.splice(
      Math.floor(maxLines / 2),
      excessLines,
      `[System: too many lines; ${excessLines} lines skipped]`
    )

    // trailing newline is restored here
    return lines.join("\n") + "\n"
  } else {
    return input
  }
}

export const createRunShellCommandTool = (user: string): Tool => {
  const name = "runShellCommandTool"
  const schema = z.object({
    command: z.string().describe("Any valid Bash command or commands."),
  })

  return createTool({
    name,
    description: [
      `Executes a Bash command in a new shell and returns the result.`,
      `The shell always starts in the project root.`,
      `Be careful to properly escape special characters. You may have to double- or triple-escape characters.`,
      `Use \`/tmp\` for temporary files.`,
    ].join(" "),
    schema,
    invoke: async (tool_call_id: string, { command }: z.infer<typeof schema>) => {
      console.log(`${name} invoked with "${command}"`)
      // const result = myExecSync(command)
      const result = await myExec(user, command)
      return [{
        role: "tool",
        tool_call_id,
        content: formatResult(result),
        name,
      }]
    },
  })
}
