---
"@ai-sdk-tools/store": patch
---

Streaming performance optimizations for ultra-smooth text rendering

**Store Package:**
- Reduced throttling from 100ms to 16ms for 60fps updates
- Added immediate updates during streaming status (no throttling)
- High-priority batching for streaming updates
- Smart sync logic that bypasses throttling during active streaming
- Optimized replaceMessage and pushMessage for streaming scenarios
- Much smoother text streaming experience
