"use client";

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  const prompts = [
    {
      text: "Analyze burn rate for TechCorp with 6 months of data: Jan 2024: $50k revenue, $80k expenses, $200k cash. Feb: $55k revenue, $85k expenses, $170k cash. Mar: $60k revenue, $90k expenses, $140k cash. Apr: $65k revenue, $88k expenses, $117k cash. May: $70k revenue, $92k expenses, $95k cash. Jun: $75k revenue, $95k expenses, $75k cash.",
      label: "📊 Analyze TechCorp Burn Rate",
      className: "px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
    },
    {
      text: "Create a burn rate analysis for StartupXYZ with monthly data showing declining runway",
      label: "🚀 Startup Analysis",
      className: "px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
    },
    {
      text: "Show me burn rate trends for a company with improving financial health",
      label: "📈 Trend Analysis",
      className: "px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
    }
  ];

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        AI Burn Rate Analyzer
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Ask me to analyze burn rate data and I'll create interactive
        charts and insights
      </p>

      {/* Example prompts */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        {prompts.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            onClick={() => onPromptClick(prompt.text)}
            className={prompt.className}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
