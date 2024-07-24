If a tool fails to respond and we have to Ctrl+C to get back to the prompt, we can't successfully send anymore messages because the OpenAI API expects a tool call to be followed by a tool response. The dangling call will result in a validation error (HTTP 400).

To work around this, we can try to auto-repair a bad message history by adding a generic error response for each dangling tool call.

---

Use ai-coder to continue developing ai-coder. Maybe start a branch for the agents.

---

Simplify return type for agents/tools. An array of messages seems to be overkill. Just return a single message.
