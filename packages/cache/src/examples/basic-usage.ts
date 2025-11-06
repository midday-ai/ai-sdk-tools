import { tool } from "ai";
import { z } from "zod";
import { cached, cacheTools } from "../index";

// Example 1: Simple weather tool with caching
const expensiveWeatherTool = tool({
  description: "Get current weather information for a location",
  inputSchema: z.object({
    location: z.string().describe("The location to get weather for"),
    units: z.enum(["celsius", "fahrenheit"]).optional().default("celsius"),
  }),
  execute: async ({ location, units }) => {
    console.log(`🌤️  Making expensive API call for ${location}...`);

    // Simulate expensive API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock weather data
    const mockData = {
      location,
      temperature: units === "celsius" ? 22 : 72,
      condition: "sunny",
      humidity: 65,
      windSpeed: 10,
      timestamp: new Date().toISOString(),
    };

    return mockData;
  },
});

// Wrap with caching
const weatherTool = cached(expensiveWeatherTool, {
  ttl: 10 * 60 * 1000, // 10 minutes
  debug: true,
});

// Example 2: Financial analysis tool
const burnRateAnalysisTool = tool({
  description: "Analyze company burn rate and financial health",
  inputSchema: z.object({
    companyId: z.string(),
    months: z.number().min(1).max(24),
  }),
  execute: async ({ companyId, months }) => {
    console.log(
      `📊 Analyzing burn rate for company ${companyId} over ${months} months...`,
    );

    // Simulate heavy computation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock analysis result
    return {
      companyId,
      analysisMonths: months,
      avgBurnRate: 50000,
      runway: 18,
      trend: "stable",
      recommendations: [
        "Monitor monthly expenses closely",
        "Consider revenue optimization",
      ],
      generatedAt: new Date().toISOString(),
    };
  },
});

// Cache with custom configuration
const cachedBurnRateTool = cached(burnRateAnalysisTool, {
  ttl: 30 * 60 * 1000, // 30 minutes
  keyGenerator: ({ params }) => `burnrate:${params.companyId}:${params.months}`,
  shouldCache: (_params, result) => {
    // Only cache successful analyses
    return result && !result.error;
  },
  onHit: (key) => console.log(`💰 Cache hit! Saved expensive analysis: ${key}`),
  onMiss: (key) => console.log(`🔄 Cache miss, running analysis: ${key}`),
});

// Example 3: Multiple tools with same cache config
const calculatorTool = tool({
  description: "Perform mathematical calculations",
  inputSchema: z.object({
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    console.log(`🧮 Calculating: ${expression}`);

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Simple expression evaluation (use a proper math parser in production)
      const result = Function(`"use strict"; return (${expression})`)();
      return { expression, result, success: true };
    } catch (_error) {
      return { expression, error: "Invalid expression", success: false };
    }
  },
});

const databaseTool = tool({
  description: "Query database for information",
  inputSchema: z.object({
    query: z.string(),
    table: z.string(),
  }),
  execute: async ({ query, table }) => {
    console.log(`🗄️  Querying ${table}: ${query}`);

    // Simulate database query
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      query,
      table,
      results: [
        { id: 1, name: "Sample Record 1" },
        { id: 2, name: "Sample Record 2" },
      ],
      count: 2,
    };
  },
});

// Cache multiple tools with same config
const { calculator, database } = cacheTools(
  {
    calculator: calculatorTool,
    database: databaseTool,
  },
  {
    ttl: 5 * 60 * 1000, // 5 minutes
    debug: true,
  },
);

/**
 * Demo function to show caching in action
 */
export async function demonstrateCache() {
  console.log("🚀 Cache Demo Starting...\n");

  // Test weather tool caching
  console.log("=== Weather Tool Demo ===");

  console.log("First call (should be slow):");
  const weather1 = await weatherTool.execute?.({ location: "New York", units: 'fahrenheit' }, {toolCallId: 'weatherTool', messages: []});
  console.log("Result:", weather1);

  console.log("\nSecond call with same params (should be fast):");
  const weather2 = await weatherTool.execute?.({ location: "New York", units: 'fahrenheit' }, {toolCallId: 'weatherTool', messages: []});
  console.log("Result:", weather2);

  console.log("\nThird call with different params (should be slow):");
  const weather3 = await weatherTool.execute?.({ location: "London", units: 'celsius' },  {toolCallId: 'weatherTool', messages: []});
  console.log("Result:", weather3);

  // Show cache stats
  console.log("\nWeather tool cache stats:", weatherTool.getStats());

  // Test burn rate tool
  console.log("\n=== Burn Rate Analysis Demo ===");

  const analysis1 = await cachedBurnRateTool.execute?.({
    companyId: "company-123",
    months: 12,
  },  {toolCallId: 'cachedBurnRateTool', messages: []});
  console.log("Analysis result:", analysis1);

  // Same params - should hit cache
  const analysis2 = await cachedBurnRateTool.execute?.({
    companyId: "company-123",
    months: 12,
  }, {toolCallId: 'cachedBurnRateTool', messages: []});
  console.log("Cached analysis:", analysis2);

  console.log("\nBurn rate tool cache stats:", cachedBurnRateTool.getStats());

  // Test multiple tools
  console.log("\n=== Multiple Tools Demo ===");

  await calculator.execute?.({ expression: "15 * 8" }, {toolCallId: 'calculator', messages: []});
  await calculator.execute?.({ expression: "15 * 8" }, {toolCallId: 'calculator', messages: []}); // Should hit cache

  await database.execute?.({ query: "SELECT * FROM users", table: "users" }, {toolCallId: 'database', messages: []});
  await database.execute?.({ query: "SELECT * FROM users", table: "users" }, {toolCallId: 'database', messages: []}); // Should hit cache

  console.log("\nCalculator cache stats:", calculator.getStats());
  console.log("Database cache stats:", database.getStats());

  console.log("\n✅ Cache demo complete!");
}

/**
 * Example showing cache management
 */
export async function demonstrateCacheManagement() {
  console.log("🔧 Cache Management Demo\n");

  const tool = cached(weatherTool, { debug: true });

  // Add some entries
  await tool.execute?.({ location: "Paris", units: 'celsius' }, {toolCallId: 'weatherTool', messages: []});
  await tool.execute?.({ location: "Tokyo", units: 'celsius' }, {toolCallId: 'weatherTool', messages: []});
  await tool.execute?.({ location: "Sydney", units: 'celsius' }, {toolCallId: 'weatherTool', messages: []});

  console.log("Cache stats after adding entries:", tool.getStats());

  // Check if specific params are cached
  console.log("Is Paris cached?", tool.isCached({ location: "Paris" }));
  console.log("Is Berlin cached?", tool.isCached({ location: "Berlin" }));

  // Clear specific entry
  const parisKey = tool.getCacheKey({ location: "Paris" });
  tool.clearCache(parisKey);
  console.log("After clearing Paris:", tool.getStats());

  // Clear all cache
  tool.clearCache();
  console.log("After clearing all:", tool.getStats());
}

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateCache()
    .then(() => demonstrateCacheManagement())
    .catch(console.error);
}
