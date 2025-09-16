"use client";

interface StoreListProps {
  storeIds: string[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
}

export function StoreList({
  storeIds,
  selectedStoreId,
  onSelectStore,
}: StoreListProps) {
  if (storeIds.length === 0) {
    return (
      <div className="ai-devtools-state-changes-empty">
        <div className="ai-devtools-state-changes-empty-content">
          <div className="ai-devtools-state-changes-empty-icon">📊</div>
          <div className="ai-devtools-state-changes-empty-title">
            No Stores Found
          </div>
          <div className="ai-devtools-state-changes-empty-description">
            Ensure you are using `@ai-sdk-tools/store` in your application.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-devtools-state-changes-list">
      <div className="ai-devtools-state-changes-header">
        <h3>Available Stores</h3>
        <span className="ai-devtools-state-changes-count">
          {storeIds.length} store{storeIds.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="ai-devtools-state-changes-items">
        {storeIds.map((storeId) => (
          <button
            key={storeId}
            type="button"
            onClick={() => onSelectStore(storeId)}
            className={`ai-devtools-state-change-item ${
              selectedStoreId === storeId ? "selected" : ""
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectStore(storeId);
              }
            }}
          >
            <div className="ai-devtools-state-change-item-content">
              <div className="ai-devtools-state-change-item-header">
                <div className="ai-devtools-state-change-type">
                  <span className="ai-devtools-state-change-type-label">
                    {storeId === "default" ? "Default" : storeId}
                  </span>
                </div>
                <span className="ai-devtools-state-change-timestamp">
                  Store
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
