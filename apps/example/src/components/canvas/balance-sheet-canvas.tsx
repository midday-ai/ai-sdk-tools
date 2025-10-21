"use client";

import { useArtifact } from "ai-sdk-tools/client";
import { BalanceSheetArtifact } from "@/ai/artifacts/balance-sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressToast } from "@/components/ui/progress-toast";

export function BalanceSheetCanvas() {
  const artifact = useArtifact(BalanceSheetArtifact);

  if (!artifact.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Loading balance sheet...
          </p>
        </div>
      </div>
    );
  }

  const data = artifact.data;
  const isLoading = data.stage !== "complete";

  return (
    <div className="h-full overflow-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1.5 pb-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl tracking-tight font-mono">{data.title}</h2>
        </div>
      </div>

      {/* Assets Section */}
      <Card className="gap-0 rounded-none bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold">Assets</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {/* Current Assets */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground">
              Current Assets
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Cash</span>
                <span className="font-mono">
                  {data.assets.currentAssets.cash.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Accounts Receivable</span>
                <span className="font-mono">
                  {data.assets.currentAssets.accountsReceivable.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Inventory</span>
                <span className="font-mono">
                  {data.assets.currentAssets.inventory.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Prepaid Expenses</span>
                <span className="font-mono">
                  {data.assets.currentAssets.prepaidExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold border-t pt-2 mt-3">
                <span>Total Current Assets</span>
                <span className="font-mono">
                  {data.assets.currentAssets.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Non-Current Assets */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground">
              Non-Current Assets
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Property, Plant & Equipment</span>
                <span className="font-mono">
                  {data.assets.nonCurrentAssets.propertyPlantEquipment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Intangible Assets</span>
                <span className="font-mono">
                  {data.assets.nonCurrentAssets.intangibleAssets.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Investments</span>
                <span className="font-mono">
                  {data.assets.nonCurrentAssets.investments.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold border-t pt-2 mt-3">
                <span>Total Non-Current Assets</span>
                <span className="font-mono">
                  {data.assets.nonCurrentAssets.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Total Assets */}
          <div className="flex justify-between items-center text-sm font-bold border-t pt-3">
            <span>Total Assets</span>
            <span className="font-mono">
              {data.assets.totalAssets.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card className="gap-0 rounded-none bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold">Liabilities</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {/* Current Liabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground">
              Current Liabilities
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Accounts Payable</span>
                <span className="font-mono">
                  {data.liabilities.currentLiabilities.accountsPayable.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Short-term Debt</span>
                <span className="font-mono">
                  {data.liabilities.currentLiabilities.shortTermDebt.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Accrued Expenses</span>
                <span className="font-mono">
                  {data.liabilities.currentLiabilities.accruedExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold border-t pt-2 mt-3">
                <span>Total Current Liabilities</span>
                <span className="font-mono">
                  {data.liabilities.currentLiabilities.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Non-Current Liabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground">
              Non-Current Liabilities
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Long-term Debt</span>
                <span className="font-mono">
                  {data.liabilities.nonCurrentLiabilities.longTermDebt.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Deferred Revenue</span>
                <span className="font-mono">
                  {data.liabilities.nonCurrentLiabilities.deferredRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Other Liabilities</span>
                <span className="font-mono">
                  {data.liabilities.nonCurrentLiabilities.otherLiabilities.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold border-t pt-2 mt-3">
                <span>Total Non-Current Liabilities</span>
                <span className="font-mono">
                  {data.liabilities.nonCurrentLiabilities.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Total Liabilities */}
          <div className="flex justify-between items-center text-sm font-bold border-t pt-3">
            <span>Total Liabilities</span>
            <span className="font-mono">
              {data.liabilities.totalLiabilities.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Equity Section */}
      <Card className="gap-0 rounded-none bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold">Equity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Common Stock</span>
              <span className="font-mono">
                {data.equity.commonStock.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Retained Earnings</span>
              <span className="font-mono">
                {data.equity.retainedEarnings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Additional Paid-in Capital</span>
              <span className="font-mono">
                {data.equity.additionalPaidInCapital.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm font-bold border-t pt-3">
            <span>Total Equity</span>
            <span className="font-mono">
              {data.equity.totalEquity.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Card className="gap-0 rounded-none bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold">
            Key Financial Ratios
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Current Ratio</p>
            <p className="text-lg font-semibold font-mono">
              {data.ratios.currentRatio.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Quick Ratio</p>
            <p className="text-lg font-semibold font-mono">
              {data.ratios.quickRatio.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Debt-to-Equity</p>
            <p className="text-lg font-semibold font-mono">
              {data.ratios.debtToEquity.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Working Capital</p>
            <p className="text-lg font-semibold font-mono">
              {data.ratios.workingCapital.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Toast */}
      <ProgressToast
        isVisible={isLoading}
        stage={data.stage}
        message={isLoading ? `${data.stage}...` : undefined}
      />
    </div>
  );
}
