# AI Coder

## Things To Try

Modify output of runShellCommand tool. Don't wrap in JSON. Return raw output from execSync. If error, return status code and error details.

Create searchProjectFiles tool that is actually an agent that uses runShellCommand to grep/find/ls/etc. based on a plain language query. Let the agent decide how to adapt the query to shell commands, and how to present the results. It might return a simple list of file paths, it might augument the list with details, it might say, "I couldn't find what you asked for, but I did find this..."

Leverage Unix users and permissions to limit what agents/tools can do. E.g. search agent should only have read access to project files.

Try increasing the temperature. The default is 0.2.

## TODOs

  - persist chat history
  - find better REPL

## Notes

graph
  - Node: Entrypoint (Agent Supervisor)
    - Node: Coder (Multi Agent Collaboration)
      - Agent: Navigator (guides Driver)
      - Agent: Driver (writes code)
        - Tool: ExecuteShellCommand
    - Agent: Git specialist
    - Agent: Researcher

AI Coach has mutltiple agents but wasn't "multi-agent" until Rysn
agents can work together to solve more complex problems
graph can be thought of as a single agent using other agents as tools
