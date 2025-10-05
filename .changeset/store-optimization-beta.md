---
"@ai-sdk-tools/store": patch
---

Optimize useChat hook to prevent unnecessary re-renders when passing server messages

- Improve store synchronization to reduce unnecessary updates
- Better handling of server messages to prevent re-renders
- Maintain compatibility with existing API while improving performance
