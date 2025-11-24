// Table component for feature #2
import ChartWrapper from "../charts/chartWrapper";
import "../dashboardLayout.css";
import { ArrowDown } from "lucide-react";

const formatCurrency = (value) =>
  `RM ${
    value
      ? value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00"
  }`;

const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    dateStyle: "short", // MM/DD/YY
    timeStyle: "medium", // hh:mm:ss AM/PM
  });
};

const SortableHeader = ({ label, onSort, sortKey, currentSortKey }) => {
  const isActive = currentSortKey === sortKey;
  return (
    <th className="sortable-header" onClick={() => onSort(sortKey)}>
      {label}
      {isActive && <ArrowDown size={20} style={{ marginLeft: "10px" }} />}
    </th>
  );
};

export function TicketSizeTable({
  data,
  loading,
  error,
  icon,
  title,
  headerActions,
  onSort,
  currentSortKey,
}) {
  const isInitialLoading = loading && (!data || data.length === 0);

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
      headerActions={headerActions}
    >
      <div className="ticket-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Status</th>
              <SortableHeader
                label="Timestamp"
                onSort={onSort}
                sortKey="timestamp"
                currentSortKey={currentSortKey}
              />
              <th>Merchant Name</th>
              <SortableHeader
                label="Amount (MYR)"
                onSort={onSort}
                sortKey="amount"
                currentSortKey={currentSortKey}
              />
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.slice(0, 10).map((ticket) => (
                <tr key={ticket.id}>
                  <td className="id-cell">{ticket.id}</td>
                  <td className="status-cell">
                    <span className={`ticket-status ${ticket.status}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td
                    className={`time-cell ${
                      currentSortKey === "timestamp" ? "active-sort" : ""
                    }`}
                  >
                    {formatTimestamp(ticket.timestamp)}
                  </td>
                  <td>{ticket.merchant}</td>
                  <td
                    className={`amount-cell ${
                      currentSortKey === "amount" ? "active-sort" : ""
                    }`}
                  >
                    {formatCurrency(ticket.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data-cell">
                  No Transaction Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ChartWrapper>
  );
}

export default TicketSizeTable;
