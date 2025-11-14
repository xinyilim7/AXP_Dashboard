// Table component for feature #2
import React from "react";
import ChartWrapper from "../charts/chartWrapper";
import "../dashboardLayout.css";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { updateTicketSort } from "../../state/dashboardSlice";

function TicketSortToggle() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(
    (state) => state.dashboard.filters.ticketSortBy
  );
  const setSort = (sortBy) => {
    dispatch(updateTicketSort(sortBy));
  };

  return (
    <div className="ticket-sort-toggle">
      <button
        className={currentSort === "amount" ? "active" : ""}
        onClick={(e) => setSort("amount")}
      >
        By Amount
      </button>
      <button
        className={currentSort === "timestamp" ? "active" : ""}
        onClick={(e) => setSort("timestamp")}
      >
        By Time
      </button>
    </div>
  );
}

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

export function TicketSizeTable({ data, loading, error, icon, title, headerActions }) {
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
              <th>Timestamp</th>
              <th>Merchant Name</th>
              <th className="amount-header">Amount (MYR)</th>
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
                  <td className="time-cell">
                    {formatTimestamp(ticket.timestamp)}
                  </td>
                  <td>{ticket.merchant}</td>
                  <td className="amount-cell">
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
