---
"@ai-sdk-tools/store": patch
---

Component splitting and Zustand v5 fixes

**Store Package:**
- Fixed infinite loop issues with proper useShallow patterns
- Improved component architecture with split chat components
- Better separation of concerns for maintainability
- Enhanced store action usage patterns

**Component Architecture:**
- Split large Chat component into focused smaller components
- Created ChatHeader, MessageList, WelcomeScreen, ChatInput, and AnalysisPanel
- Improved code organization and reusability
- Better TypeScript type safety across components
