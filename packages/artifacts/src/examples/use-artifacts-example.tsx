import { useArtifacts } from "../hooks";
import type { ArtifactData } from "../types";

/**
 * Example component showing how to use the useArtifacts hook
 * to listen for any artifact and render them with a switch case
 */
export function ArtifactsDisplay() {
  // Example 1: Using callback pattern to listen for new artifacts
  const { byType, latest, artifacts, current } = useArtifacts({
    onData: (artifactType, artifactData) => {
      console.log(`New artifact received: ${artifactType}`, artifactData);

      // You can handle different artifact types here
      switch (artifactType) {
        case "burn-rate":
          console.log("Burn rate analysis updated:", artifactData.payload);
          break;
        case "financial-report":
          console.log("Financial report updated:", artifactData.payload);
          break;
        default:
          console.log("Unknown artifact type:", artifactType);
      }
    },
  });

  return (
    <div className="artifacts-container">
      <h2>All Artifacts</h2>

      {/* Display current/most recent artifact */}
      {current && (
        <div className="current-artifact">
          <h3>Current Artifact</h3>
          <ArtifactRenderer type={current.type} artifact={current} />
        </div>
      )}

      {/* Display latest artifact of each type */}
      <div className="latest-artifacts">
        <h3>Latest by Type</h3>
        {Object.entries(latest).map(([type, artifact]) => (
          <ArtifactRenderer key={type} type={type} artifact={artifact} />
        ))}
      </div>

      {/* Display all artifacts grouped by type */}
      <div className="all-artifacts">
        <h3>All Artifacts by Type</h3>
        {Object.entries(byType).map(([type, typeArtifacts]) => (
          <div key={type} className="artifact-group">
            <h4>
              {type} ({typeArtifacts.length})
            </h4>
            {typeArtifacts.map((artifact) => (
              <ArtifactRenderer
                key={artifact.id}
                type={type}
                artifact={artifact}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Display all artifacts in chronological order */}
      <div className="chronological-artifacts">
        <h3>All Artifacts (Chronological)</h3>
        {artifacts.map((artifact) => (
          <ArtifactRenderer
            key={artifact.id}
            type={artifact.type}
            artifact={artifact}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Component to render different artifact types
 */
function ArtifactRenderer({
  type,
  artifact,
}: {
  type: string;
  artifact: ArtifactData<unknown>;
}) {
  // Switch case to render different artifact types
  switch (type) {
    case "burn-rate":
      return <BurnRateArtifact artifact={artifact} />;

    case "financial-report":
      return <FinancialReportArtifact artifact={artifact} />;

    case "chart-data":
      return <ChartArtifact artifact={artifact} />;

    default:
      return <GenericArtifact type={type} artifact={artifact} />;
  }
}

/**
 * Example burn rate artifact component
 */
function BurnRateArtifact({ artifact }: { artifact: ArtifactData<unknown> }) {
  const data = artifact.payload as Record<string, unknown>; // In real app, you'd have proper typing

  return (
    <div className="burn-rate-artifact">
      <h4>🔥 Burn Rate Analysis</h4>
      <p>Status: {artifact.status}</p>
      <p>
        Progress:{" "}
        {artifact.progress ? `${Math.round(artifact.progress * 100)}%` : "N/A"}
      </p>
      {data.title && <p>Title: {data.title}</p>}
      {data.summary && (
        <div>
          <p>Current Burn Rate: ${data.summary.currentBurnRate}</p>
          <p>Runway: {data.summary.averageRunway} months</p>
          <p>Trend: {data.summary.trend}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example financial report artifact component
 */
function FinancialReportArtifact({
  artifact,
}: {
  artifact: ArtifactData<unknown>;
}) {
  return (
    <div className="financial-report-artifact">
      <h4>📊 Financial Report</h4>
      <p>Status: {artifact.status}</p>
      <p>Version: {artifact.version}</p>
      <pre>{JSON.stringify(artifact.payload, null, 2)}</pre>
    </div>
  );
}

/**
 * Example chart artifact component
 */
function ChartArtifact({ artifact }: { artifact: ArtifactData<unknown> }) {
  return (
    <div className="chart-artifact">
      <h4>📈 Chart Data</h4>
      <p>Status: {artifact.status}</p>
      <p>Created: {new Date(artifact.createdAt).toLocaleString()}</p>
      <pre>{JSON.stringify(artifact.payload, null, 2)}</pre>
    </div>
  );
}

/**
 * Generic artifact component for unknown types
 */
function GenericArtifact({
  type,
  artifact,
}: {
  type: string;
  artifact: ArtifactData<unknown>;
}) {
  return (
    <div className="generic-artifact">
      <h4>🔧 {type}</h4>
      <p>Status: {artifact.status}</p>
      <p>Version: {artifact.version}</p>
      <p>Created: {new Date(artifact.createdAt).toLocaleString()}</p>
      <p>Updated: {new Date(artifact.updatedAt).toLocaleString()}</p>
      {artifact.error && <p className="error">Error: {artifact.error}</p>}
      <details>
        <summary>Raw Data</summary>
        <pre>{JSON.stringify(artifact.payload, null, 2)}</pre>
      </details>
    </div>
  );
}

/**
 * Example showing callback-only usage
 */
export function ArtifactsListener() {
  useArtifacts({
    onData: (artifactType, artifactData) => {
      // Handle artifacts without storing them in component state
      switch (artifactType) {
        case "burn-rate":
          // Send to analytics
          console.log("Analytics: Burn rate artifact received");
          break;
        case "user-action":
          // Log user actions
          console.log("User action tracked:", artifactData.payload);
          break;
        default:
          console.log(`Unhandled artifact type: ${artifactType}`);
      }
    },
  });

  return null; // This component only listens, doesn't render
}

/**
 * Example showing data access pattern without callbacks
 */
export function SimpleArtifactsDisplay() {
  const { latest } = useArtifacts();

  return (
    <div>
      <h2>Latest Artifacts</h2>
      {Object.entries(latest).map(([type, artifact]) => (
        <div key={type}>
          <h3>{type}</h3>
          <p>Status: {artifact.status}</p>
          <p>Updated: {new Date(artifact.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Example showing your Canvas use case - switching on current artifact
 */
export function CanvasExample() {
  const { current } = useArtifacts();

  if (!current) {
    return <div>No artifacts available</div>;
  }

  switch (current.type) {
    case "burn-rate-canvas":
      return <div>🔥 Burn Rate Canvas</div>;
    case "revenue-canvas":
      return <div>💰 Revenue Canvas</div>;
    case "profit-canvas":
      return <div>📈 Profit Canvas</div>;
    case "expenses-canvas":
      return <div>💸 Expenses Canvas</div>;
    default:
      return <div>📊 Default Canvas: {current.type}</div>;
  }
}
