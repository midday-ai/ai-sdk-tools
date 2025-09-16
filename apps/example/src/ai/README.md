# AI Module Structure

This directory contains all AI-related functionality organized by type.

## Directory Structure

```
src/ai/
├── artifacts/          # AI SDK Artifacts
│   ├── burn-rate.ts   # Burn rate analysis artifact
│   └── index.ts       # Export all artifacts
├── tools/             # AI SDK Tools
│   ├── burn-rate.ts   # Burn rate analysis tool
│   └── index.ts       # Export all tools
├── index.ts           # Main export file
└── README.md          # This file
```

## Artifacts (`/artifacts`)

Artifacts define the data schemas and streaming behavior for AI-generated content. They are used to create interactive, real-time updates in the UI.

### Example: Burn Rate Artifact

```typescript
import { BurnRateArtifact } from "@/ai/artifacts";

// Use in components
const burnRateData = useArtifact(BurnRateArtifact);
```

## Tools (`/tools`)

Tools define the AI SDK tool implementations that can be called by the AI model. They contain the business logic and return structured data.

### Example: Burn Rate Tool

```typescript
import { analyzeBurnRateTool } from "@/ai/tools";

// Use in API routes
const result = streamText({
  model: openai("gpt-4o"),
  tools: {
    analyzeBurnRate: analyzeBurnRateTool,
  },
});
```

## Adding New AI Features

1. **Create Artifact**: Define the data schema in `/artifacts/feature-name.ts`
2. **Create Tool**: Implement the tool logic in `/tools/feature-name.ts`
3. **Export**: Add exports to the respective `index.ts` files
4. **Use**: Import from `@/ai` in your components and API routes

## Best Practices

- Keep artifacts focused on data structure and streaming behavior
- Keep tools focused on business logic and AI integration
- Use descriptive names for both artifacts and tools
- Export everything through index files for clean imports
- Document complex logic and data structures
