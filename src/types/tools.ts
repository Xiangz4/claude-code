import type { AgentId } from "./ids.js";
import type { UserMessage } from "./message.js";

export type BashProgress = {
  type: "bash_progress";
  output: string;
  fullOutput: string;
  elapsedTimeSeconds: number;
  totalLines: number;
  totalBytes: number;
  taskId: string;
  timeoutMs: number;
};

export type PowerShellProgress = {
  type: "powershell_progress";
  output: string;
  fullOutput: string;
  elapsedTimeSeconds: number;
  totalLines: number;
  totalBytes: number;
  timeoutMs: number;
  taskId: string;
};

export type ShellProgress = BashProgress | PowerShellProgress;

export type AgentToolProgress = {
  type: "agent_progress";
  message: UserMessage;
  prompt: string;
  agentId: AgentId;
};

export type MCPProgress =
  | {
      type: "mcp_progress";
      status: "started";
      serverName: string;
      toolName: string;
    }
  | {
      type: "mcp_progress";
      status: "completed";
      serverName: string;
      toolName: string;
      elapsedTimeMs: number;
    }
  | {
      type: "mcp_progress";
      status: "failed";
      serverName: string;
      toolName: string;
      elapsedTimeMs: number;
    }
  | {
      type: "mcp_progress";
      status: "progress";
      serverName: string;
      toolName: string;
      progress: number;
      total: number;
      progressMessage?: string;
    };

export type SkillToolProgress = {
  type: "skill_progress";
  message: UserMessage;
  prompt: string;
  agentId: AgentId;
};

export type WebSearchProgress =
  | {
      type: "query_update";
      query: string;
    }
  | {
      type: "search_results_received";
      resultCount: number;
      query: string;
    };

export type TaskOutputProgress = {
  type: "waiting_for_task";
  taskDescription: string;
  taskType: string;
};

export type REPLToolProgress = {
  type: "repl_tool_progress";
  [key: string]: unknown;
};

export type SdkWorkflowProgress = {
  type: string;
  index: number;
  phaseIndex?: number;
  status?: string;
  label?: string;
  [key: string]: unknown;
};

export type ToolProgressData =
  | BashProgress
  | PowerShellProgress
  | AgentToolProgress
  | MCPProgress
  | SkillToolProgress
  | WebSearchProgress
  | TaskOutputProgress
  | REPLToolProgress;
