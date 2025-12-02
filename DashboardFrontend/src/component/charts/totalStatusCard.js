import React, { useMemo } from "react";
import ChartWrapper from "./chartWrapper";
import { CheckCircle, XCircle } from "lucide-react";

export function TotalStatusCard({ data, loading, error, icon }) {
  const { success, failed, successRate, failedRate } = useMemo(() => {
    {
      if (!data || data.length === 0) {
        return { success: 0, failed: 0, successRate: 0, failedRate: 0 };
      }

      /*array.reduce(accumulator, currentItem) => newA ccumulator, initialValue)) */
      const successTotal = data.reduce(
        (acc, cur) => acc + (cur.success || 0),
        0
      );
      const failedTotal = data.reduce((acc, cur) => acc + (cur.failed || 0), 0);
      const grandTotal = successTotal + failedTotal;
      const fRate =
        grandTotal === 0 ? 0 : ((failedTotal / grandTotal) * 100).toFixed(1);

      return {
        success: successTotal,
        failed: failedTotal,
        successRate: grandTotal === 0 ? 0 : ((successTotal / grandTotal) * 100).toFixed(1),
        failedRate: fRate,

        isCritical: fRate > 20 && grandTotal > 10
      };
    }
  }, [data]);

  const isInitialLoading = loading && (!data || data.length === 0);

  return (
    <ChartWrapper
      title="Transaction Summary"
      loading={isInitialLoading}
      error={error}
      icon={icon}
    >
      <div className="status-list-container">
        {/*Success Status*/}
        <div className="status-item">
          <div className="status-header-row">
            {/*Label Icon + Text*/}
            <div className="status-label success-icon">
              <span>Success Transaction</span>
            </div>
            {/*Value + Percentage*/}
            <div className="status-value-group">
              <span className="status-value">{success.toLocaleString()}</span>
              <span className="status-percentage">({successRate}%)</span>
            </div>
          </div>

          {/*Failed Status*/}
          <div className="status-item">
            <div className="status-header-row">
              {/*Label Icon + Text*/}
              <div className="status-label failed-icon">
                <span>Failed Transaction</span>
              </div>
              {/*Value + Percentage*/}
              <div className="status-value-group">
                <span className="status-value">{failed.toLocaleString()}</span>
                <span className="status-percentage">({failedRate}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}
