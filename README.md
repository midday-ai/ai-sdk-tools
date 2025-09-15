# AI SDK Tools

![AI SDK Tools](image.png)

Essential utilities that extend and improve the Vercel AI SDK experience. State management, debugging tools, and structured artifact streaming - everything you need to build production-ready AI applications beyond simple chat interfaces.

## Packages

### 🗄️ [@ai-sdk-tools/store](./packages/store)
AI chat state that scales with your application. Eliminates prop drilling within your chat components, ensuring better performance and cleaner architecture.

```bash
npm i @ai-sdk-tools/store
```

### 🔧 [@ai-sdk-tools/devtools](./packages/devtools)
Development tools for debugging AI applications. A development-only debugging tool that integrates directly into your codebase, just like react-query-devtools.

```bash
npm i @ai-sdk-tools/devtools
```

### 📦 [@ai-sdk-tools/artifacts](./packages/artifacts)
Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts that stream real-time updates from AI tools to React components. Perfect for dashboards, analytics, documents, and interactive experiences beyond chat.

```bash
npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store
```

## Quick Example

Build advanced AI interfaces with structured streaming:

```tsx
// Define an artifact
const BurnRate = artifact('burn-rate', z.object({
  title: z.string(),
  data: z.array(z.object({
    month: z.string(),
    burnRate: z.number()
  }))
}));

// Stream from AI tool
const analysis = BurnRate.stream({ title: 'Q4 Analysis' });
await analysis.update({ data: [{ month: '2024-01', burnRate: 50000 }] });
await analysis.complete({ title: 'Q4 Analysis Complete' });

// Consume in React
function Dashboard() {
  const { data, status, progress } = useArtifact(BurnRate);
  
  return (
    <div>
      <h2>{data?.title}</h2>
      {status === 'loading' && <div>Loading... {progress * 100}%</div>}
      {data?.data.map(item => (
        <div key={item.month}>{item.month}: ${item.burnRate}</div>
      ))}
    </div>
  );
}
```

## Getting Started

Visit our [website](https://ai-sdk-tools.dev) to explore interactive demos and detailed documentation for each package.

## Used by

<a href="https://midday.ai">
  <img src="https://pbs.twimg.com/profile_images/1930607581971501057/vz4YyNOV_400x400.png" alt="Midday" width="48" height="48" style="vertical-align:middle; border-radius:8px;" />
</a>

## License

MIT