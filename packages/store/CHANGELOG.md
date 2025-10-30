# @ai-sdk-tools/store

## 1.0.0

### Minor Changes

- Synchronize all package versions.

## 0.9.1

### Patch Changes

- Routine release.

## 0.7.0

### Minor Changes

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

- 8ac3dcc: ChatStatus type improvements and type safety

  **Store Package:**

  - Updated useChatStatus to return proper ChatStatus type from "ai" package
  - Improved type safety with official AI SDK types
  - Better IDE support and autocomplete for status values
  - Consistent typing with @ai-sdk/react API
  - Future-proof against AI SDK type changes

- 8ac3dcc: Component splitting and Zustand v5 fixes

  **Store Package:**

  - Fixed infinite loop issues with proper useShallow patterns
  - Improved component architecture with split chat components
  - Better separation of concerns for maintainability
  - Enhanced store action usage patterns

  **Component Architecture:**

  - Split large Chat component into focused smaller components
  - Created ChatHeader, MessageList, WelcomeScreen, ChatInput, and AnalysisPanel
  - Improved code organization and reusability
  - Better TypeScript type safety across components

- 0646b1a: Temporarily disable experimental features in beta release

  - Disable experimental exports to provide a stable beta focused on core optimization
  - Experimental features will be re-enabled in a future release
  - Clean build without TypeScript configuration issues

- 0646b1a: Enable experimental features in beta release

  - Re-enable experimental exports with proper TypeScript configuration
  - Add advanced performance hooks and optimizations
  - Include Provider, useVirtualMessages, useSelector, and other experimental features
  - Fix build issues with experimental modules

- 261ac36: New beta release with latest improvements and bug fixes
- 8ac3dcc: SSR fixes and production cleanup

  **Store Package:**

  - Fixed server-side messages being removed during client hydration
  - Cleaner useChat implementation with better SSR handling
  - Removed console logs from production builds
  - Made performance monitoring development-only
  - Improved message preservation logic for SSR scenarios

- 0646b1a: Optimize useChat hook to prevent unnecessary re-renders when passing server messages

  - Improve store synchronization to reduce unnecessary updates
  - Better handling of server messages to prevent re-renders
  - Maintain compatibility with existing API while improving performance

- 8ac3dcc: Streaming performance optimizations for ultra-smooth text rendering

  **Store Package:**

  - Reduced throttling from 100ms to 16ms for 60fps updates
  - Added immediate updates during streaming status (no throttling)
  - High-priority batching for streaming updates
  - Smart sync logic that bypasses throttling during active streaming
  - Optimized replaceMessage and pushMessage for streaming scenarios
  - Much smoother text streaming experience

## 0.7.0-beta.9

### Patch Changes

- New beta release with latest improvements and bug fixes

## 0.7.0-beta.4

### Patch Changes

- ChatStatus type improvements and type safety

  **Store Package:**

  - Updated useChatStatus to return proper ChatStatus type from "ai" package
  - Improved type safety with official AI SDK types
  - Better IDE support and autocomplete for status values
  - Consistent typing with @ai-sdk/react API
  - Future-proof against AI SDK type changes

## 0.7.0-beta.3

### Patch Changes

- Streaming performance optimizations for ultra-smooth text rendering

  **Store Package:**

  - Reduced throttling from 100ms to 16ms for 60fps updates
  - Added immediate updates during streaming status (no throttling)
  - High-priority batching for streaming updates
  - Smart sync logic that bypasses throttling during active streaming
  - Optimized replaceMessage and pushMessage for streaming scenarios
  - Much smoother text streaming experience

## 0.7.0-beta.2

### Patch Changes

- SSR fixes and production cleanup

  **Store Package:**

  - Fixed server-side messages being removed during client hydration
  - Cleaner useChat implementation with better SSR handling
  - Removed console logs from production builds
  - Made performance monitoring development-only
  - Improved message preservation logic for SSR scenarios

## 0.7.0-beta.1

### Patch Changes

- Component splitting and Zustand v5 fixes

  **Store Package:**

  - Fixed infinite loop issues with proper useShallow patterns
  - Improved component architecture with split chat components
  - Better separation of concerns for maintainability
  - Enhanced store action usage patterns

  **Component Architecture:**

  - Split large Chat component into focused smaller components
  - Created ChatHeader, MessageList, WelcomeScreen, ChatInput, and AnalysisPanel
  - Improved code organization and reusability
  - Better TypeScript type safety across components

## 0.2.0-beta.3

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

## 0.1.3-beta.2

### Patch Changes

- Enable experimental features in beta release

  - Re-enable experimental exports with proper TypeScript configuration
  - Add advanced performance hooks and optimizations
  - Include Provider, useVirtualMessages, useSelector, and other experimental features
  - Fix build issues with experimental modules

## 0.1.3-beta.1

### Patch Changes

- Temporarily disable experimental features in beta release

  - Disable experimental exports to provide a stable beta focused on core optimization
  - Experimental features will be re-enabled in a future release
  - Clean build without TypeScript configuration issues

## 0.1.3-beta.0

### Patch Changes

- Optimize useChat hook to prevent unnecessary re-renders when passing server messages

  - Improve store synchronization to reduce unnecessary updates
  - Better handling of server messages to prevent re-renders
  - Maintain compatibility with existing API while improving performance

## 0.1.2

### Patch Changes

- Beta release with improved workspace dependency management and beta release support
- Stable release with improved workspace dependency management and automated publishing workflow
- Test changeset for version management workflow

## 0.1.2-beta.0

### Patch Changes

- Beta release with improved workspace dependency management and beta release support
- Test changeset for version management workflow

## 0.1.1

### Patch Changes

- Test changeset for version management workflow
