---
"@ai-sdk-tools/store": minor
"@ai-sdk-tools/artifacts": minor
"@ai-sdk-tools/devtools": minor
---

Major performance update: Unified high-performance implementation

**Store Package:**
- Unified experimental implementation as the main and only solution
- 2-4x faster performance with all hooks
- O(1) message lookups with hash map indexing
- Batched updates with priority scheduling
- Deep equality checks prevent unnecessary re-renders
- Advanced throttling with scheduler.postTask
- Memoized selectors with automatic caching
- SSR compatible with Next.js App Router
- Solves server messages re-render issues

**Artifacts Package:**
- Updated to work seamlessly with unified store
- No more compatibility layers needed
- Improved performance through optimized store integration

**Devtools Package:**
- Fixed SSR compatibility issues
- Added proper "use client" directive
- Works correctly with unified store implementation

**Breaking Changes:**
- Requires wrapping app with `<Provider>` component
- No more `storeId` parameter needed (uses React Context)
- Some legacy exports removed (migration guide available)
