import { DynamicTool } from "langchain/tools";
import { execSync } from "node:child_process";

const TOOL_NAME = "runShellCommandTool";

type MyExecSyncResult = {
  stdout: string;
  stderr: string;
  status: number;
};

const myExecSync = (command: string): MyExecSyncResult => {
  try {
    // TODO apparently some processes write to stderr even when returning a 0 exit code
    const output = execSync([
      `docker exec -i ai-coder-sandbox sh <<'SANDBOX'`,
      command,
      `SANDBOX`,
    ].join("\n"));
    return {
      stdout: output.toString(),
      stderr: "",
      status: 0,
    };
  } catch (err: any) {
    return {
      stdout: err.stdout.toString(),
      stderr: err.stderr.toString(),
      status: err.status,
    };
  }
};

const formatResult = (result: MyExecSyncResult): string => {
  const output = result.status === 0 ? result.stdout : result.stderr;
  return limitLines(output);
};

// splitting on lines instead of characters/tokens is convenient
// but doesn't handle the case of one very long line
export const limitLines = (input: string, maxLines = 100): string => {
  if (!input) {
    return input;
  }

  const lines = input.split("\n");
  // exclude trailing newline
  lines.pop();

  if (lines.length > maxLines) {
    const excessLines = lines.length - maxLines;

    // strip lines from the middle,
    // on the assumption that the start and end lines
    // will have the most useful information
    lines.splice(
      Math.floor(maxLines / 2),
      excessLines,
      `[System: too many lines; ${excessLines} lines skipped]`
    );

    // trailing newline is restored here
    return lines.join("\n") + "\n";
  } else {
    return input;
  }
};

export const runShellCommandTool = new DynamicTool({
  name: TOOL_NAME,
  description: [
    `Executes a Bash command in a new shell and returns the result.`,
    `Each new shell starts in your home directory.`,
    `Be careful to properly escape special characters. You may have to double- or triple-escape characters.`,
  ].join(" "),
  func: async (command) => {
    // TODO handle long running commands

    console.log(`${TOOL_NAME} invoked with "${command}"`);

    const result = myExecSync(command);
    return formatResult(result);
  },
});
