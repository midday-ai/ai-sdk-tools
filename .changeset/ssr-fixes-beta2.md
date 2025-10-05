---
"@ai-sdk-tools/store": patch
---

SSR fixes and production cleanup

**Store Package:**
- Fixed server-side messages being removed during client hydration
- Cleaner useChat implementation with better SSR handling
- Removed console logs from production builds
- Made performance monitoring development-only
- Improved message preservation logic for SSR scenarios
