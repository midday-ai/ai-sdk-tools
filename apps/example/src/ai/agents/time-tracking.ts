import { openai } from "@ai-sdk/openai";
import {
  createTimeEntryTool,
  deleteTimeEntryTool,
  getTimeEntriesTool,
  getTrackerProjectsTool,
  startTimerTool,
  stopTimerTool,
  updateTimeEntryTool,
} from "../tools/tracker";
import { createAgent, formatContextForLLM } from "./shared";

export const timeTrackingAgent = createAgent({
  name: "timeTracking",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx,
  ) => `You are a time tracking specialist for ${ctx.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update time entries and timers
2. Present time data clearly (duration, project, date)
3. Summarize totals when showing multiple entries

${formatContextForLLM(ctx)}`,
  tools: {
    startTimer: startTimerTool,
    stopTimer: stopTimerTool,
    getTimeEntries: getTimeEntriesTool,
    createTimeEntry: createTimeEntryTool,
    updateTimeEntry: updateTimeEntryTool,
    deleteTimeEntry: deleteTimeEntryTool,
    getProjects: getTrackerProjectsTool,
  },
  matchOn: [
    "timer",
    "time entry",
    "time tracking",
    "hours",
    "tracked time",
    "start timer",
    "stop timer",
  ],
  maxTurns: 5,
});
