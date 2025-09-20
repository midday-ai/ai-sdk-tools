---
"@ai-sdk-tools/artifacts": patch
---

Fix infinite re-render issue in useArtifacts hook with include/exclude options

- Replace useState + useEffect with useMemo for cleaner, more efficient implementation
- Fix infinite re-render caused by array reference changes in dependencies
- Use stable string keys (includeKey, excludeKey) for proper dependency tracking
- Significantly reduce code complexity while maintaining all functionality
- Improve performance by eliminating unnecessary state management overhead
