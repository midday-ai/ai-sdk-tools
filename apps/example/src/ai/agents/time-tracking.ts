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

CORE RULES:
1. USE TOOLS IMMEDIATELY - Get data, don't ask for it
2. BE CONCISE - One clear answer with key details
3. COMPLETE THE TASK - Provide actionable information

RESPONSE STYLE:
- Lead with the key information
- Present time data clearly (duration, project, date)
- Summarize totals when showing multiple entries
- Natural conversational tone
- Use "your" to make it personal

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
  // matchOn: [
  //   "timer",
  //   "time entry",
  //   "time tracking",
  //   "hours",
  //   "tracked time",
  //   "start timer",
  //   "stop timer",
  // ],
  maxTurns: 5,
});
