# @ai-sdk-tools/cache

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

## 0.7.1

### Patch Changes

- Initial release of unified ai-sdk-tools package. Fixed use client directive handling in artifacts. Added artifacts devDependency to cache package.

## 0.3.0

### Minor Changes

- 🎉 **Artifact Context Support**: Cache now automatically detects and preserves artifact context

  ### New Features

  - **Automatic Context Detection**: Cache automatically finds context through multiple sources:

    1. `executionOptions.writer` (direct)
    2. `experimental_context.writer` (AI SDK standard)
    3. `artifacts.getContext().writer` (artifacts context - NEW!)

  - **Database Context Preservation**: Cached tools can now access database connections and user context on both cache hits and misses

  - **Zero-Config Context Preservation**: Works with existing `setContext()` calls without requiring any changes to your code

  - **Enhanced Error Handling**: Graceful fallback when artifacts package is not available

  ### Bug Fixes

  - Fixed context-dependent tools failing on cache hits
  - Improved schema preservation for cached tools
  - Better TypeScript support for artifact context types

  This release solves the common issue where cached tools couldn't access database context or user information, making caching seamless for context-dependent tools.

## 0.3.0-beta.0

### Minor Changes

- 🎉 **Artifact Context Support**: Cache now automatically detects and preserves artifact context

  ### New Features

  - **Automatic Context Detection**: Cache automatically finds context through multiple sources:

    1. `executionOptions.writer` (direct)
    2. `experimental_context.writer` (AI SDK standard)
    3. `artifacts.getContext().writer` (artifacts context - NEW!)

  - **Database Context Preservation**: Cached tools can now access database connections and user context on both cache hits and misses

  - **Zero-Config Context Preservation**: Works with existing `setContext()` calls without requiring any changes to your code

  - **Enhanced Error Handling**: Graceful fallback when artifacts package is not available

  ### Bug Fixes

  - Fixed context-dependent tools failing on cache hits
  - Improved schema preservation for cached tools
  - Better TypeScript support for artifact context types

  This release solves the common issue where cached tools couldn't access database context or user information, making caching seamless for context-dependent tools.

## 0.2.0

### Minor Changes

- **🎉 Artifact Context Support**: Cache now automatically detects and preserves artifact context
- **🔧 Enhanced Context Detection**: Automatic fallback through multiple context sources
- **🚀 Zero-Config Context Preservation**: Works with existing `setContext()` calls without changes
- **🛠️ Improved Error Handling**: Graceful fallback when artifacts package not available

### Features

- **Automatic Context Detection**: Cache automatically finds context through:
  1. `executionOptions.writer` (direct)
  2. `experimental_context.writer` (AI SDK standard)
  3. `artifacts.getContext().writer` (artifacts context - NEW!)
- **Database Context Preservation**: Cached tools can now access database connections and user context
- **Streaming + Artifacts Caching**: Complete preservation of both streaming responses AND artifact data
- **Enhanced Documentation**: Updated examples and usage patterns for artifact integration

### Bug Fixes

- Fixed context-dependent tools failing on cache hits
- Improved schema preservation for cached tools
- Better TypeScript support for artifact context types

## 0.1.0

### Minor Changes

- Initial release of @ai-sdk-tools/cache
- Simple caching wrapper for AI SDK tools with zero configuration
- LRU cache implementation with TTL support
- Support for custom cache keys and conditional caching
- Cache statistics and management methods
- Multiple tools caching with shared configuration
- Real-world examples and comprehensive documentation

### Features

- **Zero Configuration**: Works out of the box with sensible defaults
- **Flexible Caching**: TTL, max size, custom key generation
- **Performance Monitoring**: Built-in cache statistics and callbacks
- **Memory Efficient**: LRU eviction policy prevents memory leaks
- **TypeScript Support**: Full type safety with AI SDK tools
- **Lightweight**: ~2KB bundle size with no dependencies
