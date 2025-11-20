# @ai-sdk-tools/devtools

## 2.0.0

### Minor Changes

- Release version 1.1.0

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/store@2.0.0

## 1.0.8

### Patch Changes

- @ai-sdk-tools/store@1.0.8

## 1.0.7

### Patch Changes

- @ai-sdk-tools/store@1.0.7

## 1.0.6

### Patch Changes

- @ai-sdk-tools/store@1.0.6

## 1.0.5

### Patch Changes

- @ai-sdk-tools/store@1.0.5

## 1.0.4

### Patch Changes

- @ai-sdk-tools/store@1.0.4

## 1.0.3

### Patch Changes

- @ai-sdk-tools/store@1.0.3

## 1.0.2

### Patch Changes

- @ai-sdk-tools/store@1.0.2

## 1.0.1

### Patch Changes

- @ai-sdk-tools/store@1.0.1

## 1.0.0

### Minor Changes

- Synchronize all package versions.

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/store@1.0.0

## 0.9.1

### Patch Changes

- Routine release.
- Updated dependencies
  - @ai-sdk-tools/store@0.9.1

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

## 0.7.0-beta.0

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

## 0.6.1

### Patch Changes

- Beta release with improved workspace dependency management and beta release support
- Stable release with improved workspace dependency management and automated publishing workflow

## 0.6.1-beta.0

### Patch Changes

- Beta release with improved workspace dependency management and beta release support
