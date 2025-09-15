import { useArtifact } from "../hooks";
import { BurnRate } from "./burn-rate-example";

// React component showing how to consume the burn rate artifact
export function BurnRateAnalysis() {
  // useArtifact automatically gets messages from the default chat store
  // You can optionally specify a storeId: useArtifact(BurnRate, { ... }, 'my-chat-store')
  const { data, status, progress, error, isActive, hasData } = useArtifact(
    BurnRate,
    {
      onUpdate: (newData, prevData) => {
        console.log("Burn rate data updated:", newData);
        if (newData.chartData.length > (prevData?.chartData.length || 0)) {
          console.log(
            `Added data for ${newData.chartData[newData.chartData.length - 1].month}`,
          );
        }
      },

      onComplete: (finalData) => {
        console.log("✅ Analysis complete!", finalData);
        if (finalData.summary?.alerts && finalData.summary.alerts.length > 0) {
          console.log(`Found ${finalData.summary.alerts.length} alerts`);
        }
      },

      onError: (error) => {
        console.error("❌ Analysis failed:", error);
      },

      onProgress: (progress) => {
        console.log(`Progress: ${Math.round(progress * 100)}%`);
        if (progress === 0.5) {
          console.log("📊 Chart data processing complete");
        }
      },

      onStatusChange: (status) => {
        const statusMessages = {
          loading: "🔄 Starting analysis...",
          processing: "📈 Processing financial data...",
          analyzing: "🧠 Generating insights...",
          complete: "✅ Analysis complete!",
        } as const;

        if (status in statusMessages) {
          console.log(statusMessages[status as keyof typeof statusMessages]);
        }
      },
    },
  );

  // Error state
  if (status === "error") {
    return (
      <div className="error-state">
        <h3>Analysis Failed</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} type="button">
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (isActive && !hasData) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Starting analysis...</p>
      </div>
    );
  }

  // No data state
  if (!hasData) {
    return (
      <div className="empty-state">
        <p>No burn rate analysis available</p>
        <p>Ask me to analyze your company's burn rate!</p>
      </div>
    );
  }

  const { stage, title, chartData, summary } = data!;

  return (
    <div className="burn-rate-analysis">
      <h2>{title}</h2>

      {/* Progress indicator */}
      {status !== "complete" && (
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(progress || 0) * 100}%` }}
            />
          </div>
          <p className="stage-text">
            {stage === "loading" && "Initializing analysis..."}
            {stage === "processing" && "Processing financial data..."}
            {stage === "analyzing" && "Generating insights..."}
          </p>
        </div>
      )}

      {/* Chart data (shows as it streams in) */}
      {chartData.length > 0 && (
        <div className="chart-section">
          <h3>Burn Rate Trend</h3>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue</th>
                  <th>Expenses</th>
                  <th>Burn Rate</th>
                  <th>Runway</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>${row.revenue.toLocaleString()}</td>
                    <td>${row.expenses.toLocaleString()}</td>
                    <td>${row.burnRate.toLocaleString()}</td>
                    <td>{row.runway.toFixed(1)} months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary (only shows when complete) */}
      {summary && (
        <div className="summary-section">
          <h3>Analysis Summary</h3>

          <div className="metrics">
            <div className="metric">
              <span className="label">Current Burn Rate</span>
              <span className="value">
                ${summary.currentBurnRate.toLocaleString()}/month
              </span>
            </div>
            <div className="metric">
              <span className="label">Average Runway</span>
              <span className="value">
                {summary.averageRunway.toFixed(1)} months
              </span>
            </div>
            <div className="metric">
              <span className="label">Trend</span>
              <span className={`value trend-${summary.trend}`}>
                {summary.trend}
              </span>
            </div>
          </div>

          {summary.alerts.length > 0 && (
            <div className="alerts">
              <h4>⚠️ Alerts</h4>
              <ul>
                {summary.alerts.map((alert, i) => (
                  <li key={i.toString()} className="alert">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.recommendations.length > 0 && (
            <div className="recommendations">
              <h4>💡 Recommendations</h4>
              <ul>
                {summary.recommendations.map((rec, i) => (
                  <li key={i.toString()} className="recommendation">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
