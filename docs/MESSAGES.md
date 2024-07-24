# Messages

What should a converation between a user, a planner, and a coder look like?

The user doesn't talk to the coder, only the planner. The planner talks to the user and the coder. Maybe there should be multiple message histories.

**User and Planner:**

```ts
// intermediate steps are commented out
[
  { role: "user", content: "Build an app." },
  { role: "assistant", content: "Here's my plan...",
    // tool_calls: [
    //   { function: {
    //     name: "sendMessageToCoder",
    //     arguments: { message: "Run npm init." },
    //   } },
    // ],
  },
  // { role: "tool", name: "sendMessageToCoder", content: "I ran npm init." },
  // { role: "assistant",
  //   tool_calls: [
  //     { function: {
  //       name: "sendMessageToCoder",
  //       arguments: { message: "Commit your changes." }
  //     } },
  //   ],
  // },
  // { role: "tool", name: "sendMessageToCoder", content: "I committed my changes." },
  { role: "assistant", content: "I built an app." },
]
```

**Planner and Coder:**

```ts
// intermediate steps are commented out
[
  { role: "user", content: "Run npm init." }, // tool call from Planner
  // { role: "assistant",
  //   tool_calls: [
  //     { function: {
  //       name: "runShellCommand",
  //       arguments: { command: "npm init" },
  //     } },
  //   ],
  // },
  // { role: "tool", name: "runShellCommand", content: "Wrote to package.json: ..." },
  { role: "assistant", content: "I ran npm init." }, // sent as tool result
  { role: "user", content: "Commit your changes." }, // tool call from Planner
  // { role: "assistant",
  //   tool_calls: [
  //     { function: {
  //       name: "runShellCommand",
  //       arguments: { command: "git add . && git commit -m 'Initial commit'" },
  //     } },
  //   ],
  // },
  // { role: "tool", name: "runShellCommand", content: "[master 27b91c3] Initial commit" },
  { role: "assistant", content: "I committed my changes." }, // sent as tool result
]
```
