import type {
  BetaContentBlock,
  BetaMessage,
  BetaUsage as Usage,
} from "@anthropic-ai/sdk/resources/beta/messages/messages.mjs";
import type { ContentBlockParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import type { APIError } from "@anthropic-ai/sdk";
import type { UUID } from "crypto";
import type { Attachment, HookAttachment } from "../utils/attachments.js";
import type {
  HookEvent,
  SDKAssistantMessageError,
} from "../entrypoints/agentSdkTypes.js";
import type { PermissionMode } from "./permissions.js";
import type { Progress } from "../Tool.js";

// ---------------------------------------------------------------------------
// MessageOrigin
// ---------------------------------------------------------------------------

export type MessageOrigin =
  | { kind: "human" }
  | { kind: "task-notification" }
  | { kind: "channel"; server: string };

// ---------------------------------------------------------------------------
// PartialCompactDirection
// ---------------------------------------------------------------------------

export type PartialCompactDirection = "from" | "up_to";

// ---------------------------------------------------------------------------
// SystemMessageLevel
// ---------------------------------------------------------------------------

export type SystemMessageLevel = "info" | "warning" | "error";

// ---------------------------------------------------------------------------
// StopHookInfo
// ---------------------------------------------------------------------------

export type StopHookInfo = {
  command: string;
  promptText?: string;
};

// ---------------------------------------------------------------------------
// UserMessage
// ---------------------------------------------------------------------------

export type UserMessage = {
  type: "user";
  message: {
    role: "user";
    content: string | ContentBlockParam[];
  };
  uuid: UUID;
  timestamp: string;
  isMeta?: true;
  isVisibleInTranscriptOnly?: true;
  isVirtual?: true;
  isCompactSummary?: true;
  toolUseResult?: unknown;
  mcpMeta?: {
    _meta?: Record<string, unknown>;
    structuredContent?: Record<string, unknown>;
  };
  imagePasteIds?: number[];
  sourceToolAssistantUUID?: UUID;
  permissionMode?: PermissionMode;
  summarizeMetadata?: {
    messagesSummarized: number;
    userContext?: string;
    direction?: PartialCompactDirection;
  };
  origin?: MessageOrigin;
};

// ---------------------------------------------------------------------------
// AssistantMessage
// ---------------------------------------------------------------------------

export type AssistantMessage = {
  type: "assistant";
  message: BetaMessage;
  uuid: UUID;
  timestamp: string;
  usage?: Usage;
  isVirtual?: true;
  isMeta?: true;
  isApiErrorMessage?: boolean;
  apiError?: SDKAssistantMessageError;
  error?: SDKAssistantMessageError;
  errorDetails?: string;
  requestId?: string;
  advisorModel?: string;
};

// ---------------------------------------------------------------------------
// SystemMessage variants
// ---------------------------------------------------------------------------

type SystemMessageBase = {
  type: "system";
  timestamp: string;
  uuid: UUID;
  isMeta?: boolean;
};

export type SystemInformationalMessage = SystemMessageBase & {
  subtype: "informational";
  content: string;
  level: SystemMessageLevel;
  toolUseID?: string;
  preventContinuation?: boolean;
};

export type SystemPermissionRetryMessage = SystemMessageBase & {
  subtype: "permission_retry";
  content: string;
  commands: string[];
  level: SystemMessageLevel;
};

export type SystemBridgeStatusMessage = SystemMessageBase & {
  subtype: "bridge_status";
  content: string;
  url: string;
  upgradeNudge?: string;
};

export type SystemScheduledTaskFireMessage = SystemMessageBase & {
  subtype: "scheduled_task_fire";
  content: string;
};

export type SystemStopHookSummaryMessage = SystemMessageBase & {
  subtype: "stop_hook_summary";
  hookCount: number;
  hookInfos: StopHookInfo[];
  hookErrors: string[];
  preventedContinuation: boolean;
  stopReason: string | undefined;
  hasOutput: boolean;
  level: SystemMessageLevel;
  toolUseID?: string;
  hookLabel?: string;
  totalDurationMs?: number;
};

export type SystemTurnDurationMessage = SystemMessageBase & {
  subtype: "turn_duration";
  durationMs: number;
  budgetTokens?: number;
  budgetLimit?: number;
  budgetNudges?: number;
  messageCount?: number;
};

export type SystemAwaySummaryMessage = SystemMessageBase & {
  subtype: "away_summary";
  content: string;
};

export type SystemMemorySavedMessage = SystemMessageBase & {
  subtype: "memory_saved";
  writtenPaths: string[];
};

export type SystemAgentsKilledMessage = SystemMessageBase & {
  subtype: "agents_killed";
};

export type SystemApiMetricsMessage = SystemMessageBase & {
  subtype: "api_metrics";
  ttftMs: number;
  otps: number;
  isP50?: boolean;
  hookDurationMs?: number;
  turnDurationMs?: number;
  toolDurationMs?: number;
  classifierDurationMs?: number;
  toolCount?: number;
  hookCount?: number;
  classifierCount?: number;
  configWriteCount?: number;
};

export type SystemLocalCommandMessage = SystemMessageBase & {
  subtype: "local_command";
  content: string;
  level: SystemMessageLevel;
};

export type SystemThinkingMessage = SystemMessageBase & {
  subtype: "thinking";
  content: string;
};

export type SystemCompactBoundaryMessage = SystemMessageBase & {
  subtype: "compact_boundary";
  content: string;
  level: SystemMessageLevel;
  compactMetadata: {
    trigger: "manual" | "auto";
    preTokens: number;
    userContext?: string;
    messagesSummarized?: number;
  };
  logicalParentUuid?: UUID;
};

export type SystemMicrocompactBoundaryMessage = SystemMessageBase & {
  subtype: "microcompact_boundary";
  content: string;
  level: SystemMessageLevel;
  microcompactMetadata: {
    trigger: "auto";
    preTokens: number;
    tokensSaved: number;
    compactedToolIds: string[];
    clearedAttachmentUUIDs: string[];
  };
};

export type SystemAPIErrorMessage = SystemMessageBase & {
  subtype: "api_error";
  level: "error";
  cause?: Error;
  error: APIError;
  retryInMs: number;
  retryAttempt: number;
  maxRetries: number;
};

export type SystemMessage =
  | SystemInformationalMessage
  | SystemPermissionRetryMessage
  | SystemBridgeStatusMessage
  | SystemScheduledTaskFireMessage
  | SystemStopHookSummaryMessage
  | SystemTurnDurationMessage
  | SystemAwaySummaryMessage
  | SystemMemorySavedMessage
  | SystemAgentsKilledMessage
  | SystemApiMetricsMessage
  | SystemLocalCommandMessage
  | SystemThinkingMessage
  | SystemCompactBoundaryMessage
  | SystemMicrocompactBoundaryMessage
  | SystemAPIErrorMessage;

// ---------------------------------------------------------------------------
// AttachmentMessage
// ---------------------------------------------------------------------------

export type AttachmentMessage<A extends Attachment = Attachment> = {
  type: "attachment";
  attachment: A;
  uuid: UUID;
  timestamp: string;
  verbose?: boolean;
};

// ---------------------------------------------------------------------------
// ProgressMessage
// ---------------------------------------------------------------------------

export type ProgressMessage<P extends Progress = Progress> = {
  type: "progress";
  data: P;
  toolUseID: string;
  parentToolUseID: string;
  uuid: UUID;
  timestamp: string;
};

// ---------------------------------------------------------------------------
// TombstoneMessage
// ---------------------------------------------------------------------------

export type TombstoneMessage = {
  type: "tombstone";
  message: Message;
};

// ---------------------------------------------------------------------------
// StreamEvent & RequestStartEvent
// ---------------------------------------------------------------------------

export type StreamEvent = {
  type: "stream_event";
  event: BetaContentBlock;
};

export type RequestStartEvent = {
  type: "stream_request_start";
};

// ---------------------------------------------------------------------------
// ToolUseSummaryMessage
// ---------------------------------------------------------------------------

export type ToolUseSummaryMessage = {
  type: "tool_use_summary";
  summary: string;
  precedingToolUseIds: string[];
  uuid: UUID;
  timestamp: string;
};

// ---------------------------------------------------------------------------
// HookResultMessage
// ---------------------------------------------------------------------------

export type HookResultMessage = UserMessage | AttachmentMessage;

// ---------------------------------------------------------------------------
// Message (core union)
// ---------------------------------------------------------------------------

export type Message =
  | UserMessage
  | AssistantMessage
  | SystemMessage
  | AttachmentMessage
  | ProgressMessage;

// ---------------------------------------------------------------------------
// NormalizedMessage variants
// ---------------------------------------------------------------------------

export type NormalizedUserMessage = Omit<UserMessage, "message"> & {
  message: {
    role: "user";
    content: ContentBlockParam[];
  };
};

export type NormalizedAssistantMessage<
  C extends BetaContentBlock = BetaContentBlock,
> = Omit<AssistantMessage, "message"> & {
  message: Omit<BetaMessage, "content"> & {
    content: [C];
  };
};

export type NormalizedMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | AttachmentMessage
  | SystemMessage
  | ProgressMessage;

// ---------------------------------------------------------------------------
// GroupedToolUseMessage
// ---------------------------------------------------------------------------

export type GroupedToolUseMessage = {
  type: "grouped_tool_use";
  toolName: string;
  messages: NormalizedAssistantMessage[];
  results?: NormalizedUserMessage[];
  displayMessage: RenderableMessage;
  uuid: string;
  timestamp: string;
  messageId: string;
};

// ---------------------------------------------------------------------------
// CollapsedReadSearchGroup
// ---------------------------------------------------------------------------

export type CollapsedReadSearchGroup = {
  type: "collapsed_read_search";
  messages: NormalizedAssistantMessage[];
  displayMessage: RenderableMessage;
};

// ---------------------------------------------------------------------------
// CollapsibleMessage
// ---------------------------------------------------------------------------

export type CollapsibleMessage =
  | NormalizedAssistantMessage
  | NormalizedUserMessage
  | GroupedToolUseMessage;

// ---------------------------------------------------------------------------
// RenderableMessage
// ---------------------------------------------------------------------------

export type RenderableMessage =
  | NormalizedMessage
  | GroupedToolUseMessage
  | CollapsedReadSearchGroup;
