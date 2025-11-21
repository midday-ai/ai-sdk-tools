# @ai-sdk-tools/artifacts

## 2.0.0

### Minor Changes

- 1d87332: Release version 1.2.0 - Add uncontrolled mode support for useArtifacts hook

## 2.0.0

### Minor Changes

- Release version 1.1.0

## 1.0.8

## 1.0.7

## 1.0.6

## 1.0.5

## 1.0.4

## 1.0.3

## 1.0.2

## 1.0.1

## 1.0.0

### Minor Changes

- Synchronize all package versions.

## 0.9.1

### Patch Changes

- Routine release.
- 61efe54: Initial release of unified ai-sdk-tools package. Fixed use client directive handling in artifacts. Added artifacts devDependency to cache package.

## 0.8.1

### Patch Changes

- Initial release of unified ai-sdk-tools package. Fixed use client directive handling in artifacts. Added artifacts devDependency to cache package.

## 0.7.0

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

- 8ac3dcc: Major performance update: Unified high-performance implementation

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

### Patch Changes

- 1e71cc8: feat: enhance artifact versioning with createdAt timestamps and add useArtifacts hook

  - Add createdAt timestamp comparison for more accurate artifact versioning
  - Add useArtifacts hook for listening to all artifacts with filtering options (include/exclude)
  - Add extractAllArtifactsFromMessages function for comprehensive artifact extraction
  - Update version comparison logic to consider both version and createdAt timestamps
  - Improve artifact management across all types with better filtering capabilities

- e98addc: Fix infinite re-render issue in useArtifacts hook with include/exclude options

  - Replace useState + useEffect with useMemo for cleaner, more efficient implementation
  - Fix infinite re-render caused by array reference changes in dependencies
  - Use stable string keys (includeKey, excludeKey) for proper dependency tracking
  - Significantly reduce code complexity while maintaining all functionality
  - Improve performance by eliminating unnecessary state management overhead

- 19667b2: Add include/exclude filtering to useArtifacts hook

  - Add `include?: string[]` option to only listen to specified artifact types
  - Add `exclude?: string[]` option to ignore specified artifact types
  - Implement proper filtering logic that handles both include and exclude options
  - Maintain backward compatibility with existing useArtifacts usage
  - Perfect for building focused artifact UIs that only care about specific types

- 261ac36: New beta release with latest improvements and bug fixes

## 0.7.0-beta.5

### Patch Changes

- New beta release with latest improvements and bug fixes

## 0.7.0-beta.3

### Patch Changes

- Fix infinite re-render issue in useArtifacts hook with include/exclude options

  - Replace useState + useEffect with useMemo for cleaner, more efficient implementation
  - Fix infinite re-render caused by array reference changes in dependencies
  - Use stable string keys (includeKey, excludeKey) for proper dependency tracking
  - Significantly reduce code complexity while maintaining all functionality
  - Improve performance by eliminating unnecessary state management overhead

## 0.7.0-beta.2

### Patch Changes

- Add include/exclude filtering to useArtifacts hook

  - Add `include?: string[]` option to only listen to specified artifact types
  - Add `exclude?: string[]` option to ignore specified artifact types
  - Implement proper filtering logic that handles both include and exclude options
  - Maintain backward compatibility with existing useArtifacts usage
  - Perfect for building focused artifact UIs that only care about specific types

## 0.7.0-beta.1

### Patch Changes

- feat: enhance artifact versioning with createdAt timestamps and add useArtifacts hook

  - Add createdAt timestamp comparison for more accurate artifact versioning
  - Add useArtifacts hook for listening to all artifacts with filtering options (include/exclude)
  - Add extractAllArtifactsFromMessages function for comprehensive artifact extraction
  - Update version comparison logic to consider both version and createdAt timestamps
  - Improve artifact management across all types with better filtering capabilities

## 1.0.0-beta.3

### Minor Changes

- Major performance update: Unified high-performance implementation

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

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/store@0.2.0-beta.3

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
