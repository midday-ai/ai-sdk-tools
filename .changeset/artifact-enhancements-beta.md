---
"@ai-sdk-tools/artifacts": patch
---

feat: enhance artifact versioning with createdAt timestamps and add useArtifacts hook

- Add createdAt timestamp comparison for more accurate artifact versioning
- Add useArtifacts hook for listening to all artifacts with filtering options (include/exclude)
- Add extractAllArtifactsFromMessages function for comprehensive artifact extraction
- Update version comparison logic to consider both version and createdAt timestamps
- Improve artifact management across all types with better filtering capabilities
