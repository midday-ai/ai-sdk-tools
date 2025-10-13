# Release Management

This monorepo uses [Changesets](https://github.com/changesets/changesets) for automated version management and publishing.

## How It Works

### For Development

- Use `workspace:*` dependencies in `devDependencies` for local development
- Use proper version ranges in `dependencies` for published packages
- Changesets automatically handles version synchronization

### For Publishing

1. **Create a changeset**: `bun run changeset`
2. **Version packages**: `bun run version-packages` (or automated via CI)
3. **Publish**: `bun run release` (or automated via CI)

## Package Dependencies

### Current Structure

- `@ai-sdk-tools/store` (v0.1.0) - Base store package
- `@ai-sdk-tools/artifacts` (v0.2.1) - Depends on store
- `@ai-sdk-tools/devtools` (v0.6.0) - Independent package
- `@ai-sdk-tools/chrome-extension` (v1.0.0) - Depends on store and devtools

### Publishing Order

1. `@ai-sdk-tools/store` (no internal dependencies)
2. `@ai-sdk-tools/devtools` (no internal dependencies)
3. `@ai-sdk-tools/artifacts` (depends on store)
4. `@ai-sdk-tools/chrome-extension` (depends on store and devtools)

## Commands

```bash
# Development
bun run dev          # Start all packages in watch mode
bun run build        # Build all packages
bun run type-check   # Type check all packages

# Stable Releases
bun run changeset           # Create a new changeset
bun run version-packages    # Update package versions
bun run release            # Publish packages to npm

# Beta Releases
bun run changeset:beta      # Enter beta mode
bun run changeset:exit-beta # Exit beta mode
bun run version-packages:beta # Update package versions with beta tag
bun run release:beta        # Publish beta packages to npm

# Setup
./scripts/dev-setup.sh     # Initial development setup
```

## CI/CD

### Stable Releases

The main GitHub Actions workflow automatically:

1. Builds all packages
2. Creates release PRs when changesets are added
3. Publishes packages when PR is merged

### Beta Releases

Two ways to trigger beta releases:

1. **Push to beta branch**: Automatically triggers beta release workflow
2. **Manual workflow dispatch**: Go to Actions → Release → Run workflow → Select "beta"

Beta releases will:

- Use `beta` tag on npm (e.g., `1.0.0-beta.1`)
- Create beta-specific changelogs
- Allow testing before stable release
- **Exclude Chrome extension** from beta releases (only includes store, devtools, and artifacts)

## Beta Release Workflow

### Creating a Beta Release

1. **Enter beta mode**:

   ```bash
   bun run changeset:beta
   ```

2. **Create changesets** (same as stable):

   ```bash
   bun run changeset
   ```

3. **Version and publish beta**:

   ```bash
   bun run version-packages:beta
   bun run release:beta
   ```

4. **Exit beta mode**:
   ```bash
   bun run changeset:exit-beta
   ```

### Installing Beta Packages

Users can install beta versions using various package managers:

**npm:**

```bash
npm install @ai-sdk-tools/store@beta
npm install @ai-sdk-tools/artifacts@beta
npm install @ai-sdk-tools/devtools@beta
```

**yarn:**

```bash
yarn add @ai-sdk-tools/store@beta
yarn add @ai-sdk-tools/artifacts@beta
yarn add @ai-sdk-tools/devtools@beta
```

**pnpm:**

```bash
pnpm add @ai-sdk-tools/store@beta
pnpm add @ai-sdk-tools/artifacts@beta
pnpm add @ai-sdk-tools/devtools@beta
```

**bun:**

```bash
bun add @ai-sdk-tools/store@beta
bun add @ai-sdk-tools/artifacts@beta
bun add @ai-sdk-tools/devtools@beta
```

> Note: Chrome extension is not available in beta releases

### Installing Stable Packages

Users can install stable versions using various package managers:

**npm:**

```bash
npm install @ai-sdk-tools/store
npm install @ai-sdk-tools/artifacts
npm install @ai-sdk-tools/devtools
npm install @ai-sdk-tools/chrome-extension
```

**yarn:**

```bash
yarn add @ai-sdk-tools/store
yarn add @ai-sdk-tools/artifacts
yarn add @ai-sdk-tools/devtools
yarn add @ai-sdk-tools/chrome-extension
```

**pnpm:**

```bash
pnpm add @ai-sdk-tools/store
pnpm add @ai-sdk-tools/artifacts
pnpm add @ai-sdk-tools/devtools
pnpm add @ai-sdk-tools/chrome-extension
```

**bun:**

```bash
bun add @ai-sdk-tools/store
bun add @ai-sdk-tools/artifacts
bun add @ai-sdk-tools/devtools
bun add @ai-sdk-tools/chrome-extension
```

## Best Practices

1. **Always create changesets** for any changes that should be published
2. **Use semantic versioning** (patch, minor, major)
3. **Test beta releases** before promoting to stable
4. **Use beta releases** for breaking changes or major features
5. **Test locally** before creating changesets
6. **Review release PRs** carefully before merging
7. **Keep dependencies up to date** using proper version ranges

## Troubleshooting

### Workspace Dependencies

- Never use `workspace:*` in `dependencies` for published packages
- Use `workspace:*` only in `devDependencies` for local development
- Use proper version ranges (`^1.0.0`) for published dependencies

### Version Conflicts

- Changesets automatically handles version synchronization
- If manual intervention needed, update package.json versions and run `bun run version-packages`

### Publishing Issues

- Ensure all packages build successfully before publishing
- Check that NPM_TOKEN is set in GitHub secrets
- Verify package access permissions
