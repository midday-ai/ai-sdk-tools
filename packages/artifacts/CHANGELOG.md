# @ai-sdk-tools/artifacts

## 0.5.0-beta.2

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/store@0.1.3-beta.2

## 0.5.0-beta.1

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/store@0.1.3-beta.1

## 0.5.0-beta.0

### Minor Changes

- 299a914: Release v0.4.0 with new useArtifacts hook and comprehensive improvements

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

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/store@0.1.3-beta.0

## 0.4.0

### Minor Changes

- Release v0.4.0 with new useArtifacts hook and comprehensive improvements

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

- 5f92097: Add useArtifacts hook for listening to all artifact types

  - Add new `useArtifacts` hook that listens to all artifacts across all types
  - Perfect for implementing switch cases to render different artifact types
  - Provides callback pattern with `onData` for real-time notifications
  - Returns `data` (grouped by type), `latestByType`, and `all` (chronological)
  - Update documentation with correct import patterns (`/client` for hooks)
  - Fix API examples to use `artifact()` instead of deprecated `createArtifact()`
  - Add comprehensive examples and usage patterns
  - Update website documentation to match package README

### Patch Changes

- 5f92097: Improve useArtifacts hook implementation and add comprehensive examples

  - Enhanced useArtifacts hook with better type safety and performance
  - Added comprehensive usage examples and documentation
  - Improved client exports and API consistency
  - Updated website documentation to match latest features

## 0.4.0-beta.1

### Patch Changes

- Improve useArtifacts hook implementation and add comprehensive examples

  - Enhanced useArtifacts hook with better type safety and performance
  - Added comprehensive usage examples and documentation
  - Improved client exports and API consistency
  - Updated website documentation to match latest features

## 0.4.0-beta.0

### Minor Changes

- Add useArtifacts hook for listening to all artifact types

  - Add new `useArtifacts` hook that listens to all artifacts across all types
  - Perfect for implementing switch cases to render different artifact types
  - Provides callback pattern with `onData` for real-time notifications
  - Returns `data` (grouped by type), `latestByType`, and `all` (chronological)
  - Update documentation with correct import patterns (`/client` for hooks)
  - Fix API examples to use `artifact()` instead of deprecated `createArtifact()`
  - Add comprehensive examples and usage patterns
  - Update website documentation to match package README

## 0.3.0

### Minor Changes

- **Fixed dynamic require issue**: Resolved "dynamic usage of require is not supported" error by updating tsup configuration to use static imports instead of dynamic requires
- **Improved build configuration**: Added proper external dependencies and esbuild options for better compatibility with modern bundlers like Turbopack
- **Enhanced React compatibility**: Fixed React imports to work properly with both CommonJS and ESM builds
- **Better TypeScript support**: Improved type definitions and build output for better developer experience

### Technical Improvements

- Updated tsup configuration to properly handle React and store dependencies
- Fixed build process to generate clean static imports
- Improved compatibility with modern JavaScript bundlers
- Enhanced error handling and type safety

## 0.2.3

### Patch Changes

- Beta release with improved workspace dependency management and beta release support
- Stable release with improved workspace dependency management and automated publishing workflow
- Test changeset for version management workflow
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @ai-sdk-tools/store@0.1.2

## 0.2.3-beta.0

### Patch Changes

- Beta release with improved workspace dependency management and beta release support
- Test changeset for version management workflow

## 0.2.2

### Patch Changes

- Test changeset for version management workflow
- Updated dependencies
  - @ai-sdk-tools/store@0.1.1
