import { openai } from "@ai-sdk/openai";
import { cached } from "@/lib/cache"; // Use pre-configured cache
import { getBurnRate, getRunway, getSpending } from "@/lib/mock-db-queries";
import { formatAmount, safeValue, generateFollowupQuestions } from "@/lib/mock-utils";
import { generateText, smoothStream, streamText, tool } from "ai";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { BurnRateArtifact } from "@/ai/artifacts/burn-rate";
import { followupQuestionsArtifact } from "@/ai/artifacts/followup-questions";
import { getContext } from "@/ai/context";
import { getBurnRateSchema } from "./schema";

export const complexBurnRateAnalysis = tool({
  description:
    "Generate comprehensive burn rate analysis with interactive visualizations, spending trends, runway projections, and actionable insights. This mirrors the real-world tool to test complex streaming and caching patterns.",
  inputSchema: getBurnRateSchema.omit({ showCanvas: true }),
  execute: async function* ({ from, to, currency }) {
    try {
      const context = getContext();

      // Always create canvas for analysis tool
      const analysis = BurnRateArtifact.stream({
        stage: "loading",
        title: "Complex Burn Rate Analysis",
        currency: currency ?? context.user.baseCurrency ?? "USD",
        chartData: [],
        progress: 0,
      });

      // Generate a contextual initial message based on the analysis request
      const initialMessageStream = streamText({
        model: openai("gpt-4o-mini"),
        temperature: 0.2,
        system: `You are a financial assistant generating a brief initial message for a burn rate analysis. 

The user has requested a burn rate analysis for the period ${from} to ${to}. Create a message that:
- Acknowledges the specific time period being analyzed
- Explains what you're currently doing (gathering financial data)
- Mentions the specific insights they'll receive (monthly burn rate, cash runway, expense breakdown)
- Uses a warm, personal tone while staying professional
- Uses the user's first name (${safeValue(context?.user.fullName?.split(" ")[0]) || "there"}) when appropriate
- Shows genuine interest in their financial well-being
- Avoids generic phrases like "Got it! Let's dive into..." or "Thanks for reaching out"
- Keep it concise (1-2 sentences max)

Example format: "I'm analyzing your burn rate data for [period] to show your monthly spending patterns, cash runway, and expense breakdown."`,
        messages: [
          {
            role: "user",
            content: `Generate a brief initial message for a burn rate analysis request for the period ${from} to ${to}.`,
          },
        ],
        experimental_transform: smoothStream({ chunking: "word" }),
      });

      let completeMessage = "";
      for await (const chunk of initialMessageStream.textStream) {
        completeMessage += chunk;
        // Yield the accumulated text so far for streaming effect
        yield { text: completeMessage };
      }

      // Add line breaks to prepare for the detailed analysis
      completeMessage += "\n";

      // Yield to continue processing while showing loading step
      yield { text: completeMessage };

      // Run all database queries in parallel for maximum performance
      const [burnRateData, runway, spendingData] = await Promise.all([
        getBurnRate(context.db, {
          teamId: context.user.teamId,
          from,
          to,
          currency: currency ?? undefined,
        }),
        getRunway(context.db, {
          teamId: context.user.teamId,
          from,
          to,
          currency: currency ?? undefined,
        }),
        getSpending(context.db, {
          teamId: context.user.teamId,
          from,
          to,
          currency: currency ?? undefined,
        }),
      ]);

      console.log("Database results:", { burnRateData: burnRateData.length, runway, spendingData: spendingData.length });

      // Early return if no data
      if (burnRateData.length === 0) {
        await analysis.update({
          stage: "complete",
          summary: {
            currentBurnRate: 0,
            averageRunway: 0,
            trend: "stable" as const,
            alerts: ["No data available"],
            recommendations: ["Check date range selection"],
          },
        });

        yield { text: completeMessage + "\n\nNo burn rate data available for the selected period." };
        return {
          currentMonthlyBurn: 0,
          runway: 0,
          topCategory: "No data",
          summary: "No data available",
        };
      }

      // Calculate basic metrics from burn rate data
      const currentMonthlyBurn = burnRateData[burnRateData.length - 1]?.value || 0;
      const averageBurnRate = Math.round(
        burnRateData.reduce((sum, item) => sum + item.value, 0) / burnRateData.length
      );

      // Generate monthly chart data
      const fromDate = startOfMonth(new Date(from));
      const toDate = endOfMonth(new Date(to));
      const monthSeries = eachMonthOfInterval({
        start: fromDate,
        end: toDate,
      });

      const monthlyData = monthSeries.map((month, index) => {
        const currentBurn = burnRateData[index]?.value || 0;
        return {
          month: format(month, "MMM"),
          revenue: Math.floor(Math.random() * 30000) + 20000,
          expenses: currentBurn + Math.floor(Math.random() * 10000),
          burnRate: currentBurn,
          runway: Math.max(1, runway - index),
        };
      });

      // Update with chart data
      await analysis.update({
        stage: "processing",
        chartData: monthlyData,
        progress: 0.4,
      });

      yield { text: completeMessage + "\n\nProcessing financial data and generating insights..." };

      // Get the highest spending category
      const highestCategory = spendingData[0] || {
        name: "Uncategorized",
        slug: "uncategorized",
        amount: 0,
        percentage: 0,
      };

      // Calculate burn rate change
      const burnRateStartValue = burnRateData[0]?.value || 0;
      const burnRateEndValue = currentMonthlyBurn;
      const burnRateChangePercentage = burnRateStartValue > 0
        ? Math.round(((burnRateEndValue - burnRateStartValue) / burnRateStartValue) * 100)
        : 0;
      const burnRateChangePeriod = `${burnRateData.length} months`;

      // Update with metrics
      await analysis.update({
        stage: "analyzing",
        progress: 0.7,
        summary: {
          currentBurnRate: currentMonthlyBurn,
          averageRunway: runway,
          trend: burnRateChangePercentage > 5 ? "declining" as const : 
                 burnRateChangePercentage < -5 ? "improving" as const : "stable" as const,
          alerts: runway < 6 ? ["Critical: Low runway"] : [],
          recommendations: ["Monitor spending trends", "Plan for future growth"],
        },
      });

      const targetCurrency = currency ?? context.user.baseCurrency ?? "USD";

      // Generate AI summary
      const analysisResult = await generateText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "user",
            content: `Analyze this burn rate data:

Monthly Burn: ${formatAmount({ amount: currentMonthlyBurn, currency: targetCurrency, locale: context.user.locale })}
Runway: ${runway} months
Change: ${burnRateChangePercentage}% over ${burnRateChangePeriod}
Top Category: ${highestCategory.name} (${highestCategory.percentage}%)

Provide a concise 2-sentence summary and 2-3 brief recommendations.`,
          },
        ],
      });

      const responseText = analysisResult.text;
      const lines = responseText.split("\n").filter((line) => line.trim().length > 0);
      const summaryText = lines[0] || `Current monthly burn: ${formatAmount({ amount: currentMonthlyBurn, currency: targetCurrency, locale: context.user.locale })} with ${runway}-month runway.`;
      const recommendations = lines.slice(1, 4).map((line) => line.replace(/^[-•*]\s*/, "").trim()).filter((line) => line.length > 0);

      // Final update
      await analysis.complete({
        stage: "complete",
        title: "Complex Burn Rate Analysis",
        chartData: monthlyData,
        progress: 1,
        summary: {
          currentBurnRate: currentMonthlyBurn,
          averageRunway: runway,
          trend: burnRateChangePercentage > 5 ? "declining" as const : 
                 burnRateChangePercentage < -5 ? "improving" as const : "stable" as const,
          alerts: runway < 6 ? ["Critical: Low runway"] : [],
          recommendations,
        },
      });

      // Stream the detailed analysis
      const burnRateAnalysisData = {
        currentMonthlyBurn: formatAmount({ amount: currentMonthlyBurn, currency: targetCurrency, locale: context.user.locale }),
        runway,
        topCategory: highestCategory.name,
        topCategoryPercentage: highestCategory.percentage,
        burnRateChange: burnRateChangePercentage,
        burnRateChangePeriod,
        runwayStatus: runway >= 12 ? "healthy" : runway >= 6 ? "concerning" : "critical",
      };

      const responseStream = streamText({
        model: openai("gpt-4o-mini"),
        system: `Generate a detailed burn rate analysis using the provided data. Format it with clear sections for Monthly Burn Rate, Cash Runway, Expense Breakdown, and Trends.`,
        messages: [
          {
            role: "user",
            content: `Generate analysis: ${JSON.stringify(burnRateAnalysisData)}`,
          },
        ],
        experimental_transform: smoothStream({ chunking: "word" }),
      });

      // Yield the streamed response
      let analysisText = "";
      for await (const chunk of responseStream.textStream) {
        analysisText += chunk;
        yield { text: completeMessage + analysisText };
      }

      completeMessage += analysisText;

      // Generate follow-up questions
      const burnRateFollowupQuestions = await generateFollowupQuestions(
        "complexBurnRateAnalysis",
        completeMessage,
      );

      // Stream follow-up questions artifact
      const followupStream = followupQuestionsArtifact.stream({
        questions: burnRateFollowupQuestions,
        context: "burn_rate_analysis",
        timestamp: new Date().toISOString(),
      });

      await followupStream.complete();

      // Final yield
      yield {
        text: completeMessage,
        forceStop: true,
      };

      return {
        success: true,
        currentMonthlyBurn: formatAmount({ amount: currentMonthlyBurn, currency: targetCurrency, locale: context.user.locale }),
        runway,
        topCategory: highestCategory.name,
        summary: summaryText,
        analysisComplete: true,
      };
    } catch (error) {
      console.error("Complex burn rate analysis error:", error);
      throw error;
    }
  },
});

export const complexBurnRateAnalysisTool = cached(complexBurnRateAnalysis);
