import { tool } from "ai";
import { z } from "zod";
import { cached } from "../";

// Example 1: External API integration with caching
const weatherApiTool = cached(
  tool({
    description: "Get real weather data from external API",
    parameters: z.object({
      location: z.string(),
      units: z.enum(["metric", "imperial"]).default("metric"),
    }),
    execute: async ({ location, units }) => {
      // In real app, this would be an actual API call
      const apiKey = process.env.WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      return response.json();
    },
  }),
  {
    ttl: 10 * 60 * 1000, // 10 minutes - weather doesn't change that fast
    keyGenerator: ({ location, units }) => `weather:${location.toLowerCase()}:${units}`,
    shouldCache: (_, result) => {
      // Don't cache errors
      return !result.error && result.main;
    },
    onHit: (key) => console.log(`💰 Saved API call: ${key}`),
    onMiss: (key) => console.log(`🌐 Making API call: ${key}`),
  }
);

// Example 2: Database query caching
const userProfileTool = cached(
  tool({
    description: "Get user profile information",
    parameters: z.object({
      userId: z.string(),
      includePreferences: z.boolean().default(false),
    }),
    execute: async ({ userId, includePreferences }) => {
      // Simulate database query
      console.log(`🗄️  Querying database for user ${userId}`);
      
      // In real app, this would be a database query
      const baseProfile = {
        id: userId,
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2023-01-01T00:00:00Z",
      };

      if (includePreferences) {
        // Additional expensive query
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
          ...baseProfile,
          preferences: {
            theme: "dark",
            notifications: true,
            language: "en",
          },
        };
      }

      return baseProfile;
    },
  }),
  {
    ttl: 5 * 60 * 1000, // 5 minutes - user data changes occasionally
    keyGenerator: ({ userId, includePreferences }) => 
      `user:${userId}:prefs:${includePreferences}`,
    onHit: () => console.log("💾 Database query avoided"),
  }
);

// Example 3: Heavy computation caching
const financialAnalysisTool = cached(
  tool({
    description: "Perform complex financial analysis",
    parameters: z.object({
      companyId: z.string(),
      analysisType: z.enum(["burnRate", "growth", "profitability"]),
      timeframe: z.number().min(1).max(36), // months
    }),
    execute: async ({ companyId, analysisType, timeframe }) => {
      console.log(`📊 Running ${analysisType} analysis for ${companyId} over ${timeframe} months`);
      
      // Simulate heavy computation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock complex analysis result
      const baseMetrics = {
        companyId,
        analysisType,
        timeframe,
        generatedAt: new Date().toISOString(),
      };

      switch (analysisType) {
        case "burnRate":
          return {
            ...baseMetrics,
            monthlyBurnRate: 75000,
            runway: 18,
            trend: "improving",
            recommendations: ["Optimize marketing spend", "Focus on retention"],
          };
        case "growth":
          return {
            ...baseMetrics,
            monthlyGrowthRate: 0.15,
            projectedRevenue: 2400000,
            growthTrend: "accelerating",
          };
        case "profitability":
          return {
            ...baseMetrics,
            grossMargin: 0.68,
            netMargin: 0.12,
            breakEvenPoint: "Q3 2024",
          };
        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }
    },
  }),
  {
    ttl: 60 * 60 * 1000, // 1 hour - financial analysis is expensive
    keyGenerator: ({ companyId, analysisType, timeframe }) => 
      `analysis:${companyId}:${analysisType}:${timeframe}`,
    shouldCache: (_, result) => {
      // Only cache successful analyses
      return result && !result.error && result.generatedAt;
    },
    onHit: (key) => console.log(`🎯 Avoided expensive computation: ${key}`),
    onMiss: (key) => console.log(`⚡ Running expensive computation: ${key}`),
  }
);

// Example 4: Translation service with long-term caching
const translationTool = cached(
  tool({
    description: "Translate text to different languages",
    parameters: z.object({
      text: z.string(),
      targetLanguage: z.string(),
      sourceLanguage: z.string().default("auto"),
    }),
    execute: async ({ text, targetLanguage, sourceLanguage }) => {
      console.log(`🌍 Translating "${text}" to ${targetLanguage}`);
      
      // In real app, this would call a translation API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock translation result
      return {
        originalText: text,
        translatedText: `[${targetLanguage.toUpperCase()}] ${text}`, // Mock translation
        sourceLanguage: sourceLanguage === "auto" ? "en" : sourceLanguage,
        targetLanguage,
        confidence: 0.95,
      };
    },
  }),
  {
    ttl: 24 * 60 * 60 * 1000, // 24 hours - translations don't change
    keyGenerator: ({ text, targetLanguage, sourceLanguage }) => {
      // Use base64 encoding for text to handle special characters
      const encodedText = Buffer.from(text).toString("base64");
      return `translate:${encodedText}:${sourceLanguage}:${targetLanguage}`;
    },
    maxSize: 5000, // Store more translations
    onHit: (key) => console.log(`💬 Translation cache hit: ${key.slice(0, 50)}...`),
  }
);

// Example 5: File processing with conditional caching
const documentAnalysisTool = cached(
  tool({
    description: "Analyze document content and extract insights",
    parameters: z.object({
      documentId: z.string(),
      analysisDepth: z.enum(["basic", "detailed", "comprehensive"]),
    }),
    execute: async ({ documentId, analysisDepth }) => {
      console.log(`📄 Analyzing document ${documentId} with ${analysisDepth} depth`);
      
      // Simulate document processing time based on depth
      const processingTime = {
        basic: 500,
        detailed: 2000,
        comprehensive: 5000,
      };
      
      await new Promise(resolve => setTimeout(resolve, processingTime[analysisDepth]));
      
      const baseAnalysis = {
        documentId,
        analysisDepth,
        wordCount: 1250,
        language: "en",
        processedAt: new Date().toISOString(),
      };

      if (analysisDepth === "basic") {
        return {
          ...baseAnalysis,
          summary: "Basic document summary",
          keyTopics: ["topic1", "topic2"],
        };
      }

      if (analysisDepth === "detailed") {
        return {
          ...baseAnalysis,
          summary: "Detailed document analysis with insights",
          keyTopics: ["topic1", "topic2", "topic3"],
          sentiment: "positive",
          entities: ["Entity1", "Entity2"],
        };
      }

      // Comprehensive
      return {
        ...baseAnalysis,
        summary: "Comprehensive document analysis with full insights",
        keyTopics: ["topic1", "topic2", "topic3", "topic4"],
        sentiment: "positive",
        entities: ["Entity1", "Entity2", "Entity3"],
        relationships: [{ from: "Entity1", to: "Entity2", type: "related" }],
        recommendations: ["Recommendation 1", "Recommendation 2"],
      };
    },
  }),
  {
    ttl: 30 * 60 * 1000, // 30 minutes
    keyGenerator: ({ documentId, analysisDepth }) => 
      `doc:${documentId}:${analysisDepth}`,
    shouldCache: (params, result) => {
      // Only cache successful analyses for detailed/comprehensive
      return result && !result.error && params.analysisDepth !== "basic";
    },
    onHit: (key) => console.log(`📋 Document analysis cache hit: ${key}`),
    onMiss: (key) => console.log(`🔍 Processing document: ${key}`),
  }
);

/**
 * Demo function showing real-world caching scenarios
 */
export async function demonstrateRealWorldCaching() {
  console.log("🌟 Real-World Caching Demo\n");

  // Weather API caching
  console.log("=== Weather API Caching ===");
  await weatherApiTool.execute({ location: "New York" });
  await weatherApiTool.execute({ location: "New York" }); // Cache hit
  await weatherApiTool.execute({ location: "New York", units: "imperial" }); // Different cache key
  
  console.log("Weather tool stats:", weatherApiTool.getStats());

  // User profile caching
  console.log("\n=== User Profile Caching ===");
  await userProfileTool.execute({ userId: "user123" });
  await userProfileTool.execute({ userId: "user123" }); // Cache hit
  await userProfileTool.execute({ userId: "user123", includePreferences: true }); // Different cache key
  
  console.log("User profile tool stats:", userProfileTool.getStats());

  // Financial analysis caching
  console.log("\n=== Financial Analysis Caching ===");
  await financialAnalysisTool.execute({ 
    companyId: "company-abc", 
    analysisType: "burnRate", 
    timeframe: 12 
  });
  await financialAnalysisTool.execute({ 
    companyId: "company-abc", 
    analysisType: "burnRate", 
    timeframe: 12 
  }); // Cache hit - saves 3 seconds!
  
  console.log("Financial analysis tool stats:", financialAnalysisTool.getStats());

  // Translation caching
  console.log("\n=== Translation Caching ===");
  await translationTool.execute({ 
    text: "Hello, how are you?", 
    targetLanguage: "es" 
  });
  await translationTool.execute({ 
    text: "Hello, how are you?", 
    targetLanguage: "es" 
  }); // Cache hit
  
  console.log("Translation tool stats:", translationTool.getStats());

  // Document analysis with conditional caching
  console.log("\n=== Document Analysis Caching ===");
  await documentAnalysisTool.execute({ 
    documentId: "doc123", 
    analysisDepth: "basic" 
  }); // Won't be cached (basic analysis)
  
  await documentAnalysisTool.execute({ 
    documentId: "doc123", 
    analysisDepth: "detailed" 
  }); // Will be cached
  
  await documentAnalysisTool.execute({ 
    documentId: "doc123", 
    analysisDepth: "detailed" 
  }); // Cache hit
  
  console.log("Document analysis tool stats:", documentAnalysisTool.getStats());

  console.log("\n✅ Real-world caching demo complete!");
}

/**
 * Performance comparison demo
 */
export async function demonstratePerformanceGains() {
  console.log("⚡ Performance Comparison Demo\n");

  // Create uncached version for comparison
  const uncachedAnalysisTool = tool({
    description: "Uncached financial analysis",
    parameters: z.object({
      companyId: z.string(),
      analysisType: z.enum(["burnRate"]),
    }),
    execute: async ({ companyId, analysisType }) => {
      console.log(`🐌 Running uncached analysis for ${companyId}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      return { companyId, analysisType, result: "analysis complete" };
    },
  });

  const params = { companyId: "test-company", analysisType: "burnRate" as const };

  // Test uncached performance
  console.log("Testing uncached tool (2 calls):");
  const uncachedStart = Date.now();
  await uncachedAnalysisTool.execute(params);
  await uncachedAnalysisTool.execute(params);
  const uncachedTime = Date.now() - uncachedStart;
  console.log(`Uncached total time: ${uncachedTime}ms\n`);

  // Test cached performance
  console.log("Testing cached tool (2 calls):");
  const cachedStart = Date.now();
  await financialAnalysisTool.execute(params);
  await financialAnalysisTool.execute(params); // This should be instant
  const cachedTime = Date.now() - cachedStart;
  console.log(`Cached total time: ${cachedTime}ms`);

  const speedup = uncachedTime / cachedTime;
  console.log(`\n🚀 Speedup: ${speedup.toFixed(1)}x faster with caching!`);
  console.log(`💰 Time saved: ${uncachedTime - cachedTime}ms`);
}

// Run demos if this file is executed directly
if (require.main === module) {
  demonstrateRealWorldCaching()
    .then(() => demonstratePerformanceGains())
    .catch(console.error);
}
