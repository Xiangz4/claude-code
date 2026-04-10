export type QuerySource =
  | "repl_main_thread"
  | `repl_main_thread:outputStyle:${string}`
  | "sdk"
  | "compact"
  | "session_memory"
  | "hook_agent"
  | "verification_agent"
  | "magic_docs"
  | "tool_use_summary_generation"
  | "auto_dream"
  | "memdir_relevance"
  | "marble_origami"
  | `agent:${string}`
  | "agent:default"
  | "agent:custom"
  | (string & {});
