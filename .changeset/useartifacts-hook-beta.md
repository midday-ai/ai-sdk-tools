---
"@ai-sdk-tools/artifacts": minor
---

Add useArtifacts hook for listening to all artifact types

- Add new `useArtifacts` hook that listens to all artifacts across all types
- Perfect for implementing switch cases to render different artifact types
- Provides callback pattern with `onData` for real-time notifications
- Returns `data` (grouped by type), `latestByType`, and `all` (chronological)
- Update documentation with correct import patterns (`/client` for hooks)
- Fix API examples to use `artifact()` instead of deprecated `createArtifact()`
- Add comprehensive examples and usage patterns
- Update website documentation to match package README
