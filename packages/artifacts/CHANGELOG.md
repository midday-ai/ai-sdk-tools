# @ai-sdk-tools/artifacts

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
