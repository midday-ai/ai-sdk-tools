---
"@ai-sdk-tools/artifacts": minor
---

Release v0.4.0 with new useArtifacts hook and comprehensive improvements

This stable release includes all the features from the beta versions:

**New Features:**
- Add new `useArtifacts` hook that listens to all artifacts across all types
- Perfect for implementing switch cases to render different artifact types
- Provides callback pattern with `onData` for real-time notifications
- Returns `data` (grouped by type), `latestByType`, and `all` (chronological)

**Improvements:**
- Enhanced useArtifacts hook with better type safety and performance
- Added comprehensive usage examples and documentation
- Improved client exports and API consistency
- Updated documentation with correct import patterns (`/client` for hooks)
- Fixed API examples to use `artifact()` instead of deprecated `createArtifact()`
- Updated website documentation to match package features

**Developer Experience:**
- Added comprehensive examples showing real-world usage patterns
- Better type definitions and TypeScript support
- Improved error handling and edge case coverage
