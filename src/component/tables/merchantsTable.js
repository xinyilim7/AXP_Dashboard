// Table component for feature #3
import React from "react";
import ChartWrapper from "../charts/chartWrapper";
import "../dashboardLayout.css";
import {ArrowDown, ArrowUp} from "lucide-react";

const formatCurrency = (value) =>
  `RM${
    value
      ? value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maxFractionDigits: 2,
        })
      : "0.00"
  }`;

const SortableHeader = ({label, onSort, sortKey, currentSortKey})=>{
  const isActive = currentSortKey === sortKey;
  return (
    <th className="sortable-header" onClick={()=> onSort(sortKey)}>
      {label}
      {isActive && <ArrowDown size={14} style={{marginLeft: '4px'}}/>}
    </th>
  );
};

export function MerchantTable({ data, loading, error, title, headerActions, icon, onSort, currentSortKey}) {
  const isInitialLoading = loading && (!data || data.length === 0);

  // Check if data has at least one row but fewer than 10 rows
  const dataRow = data ? data.slice(0,10) : []; // Get top 10 merchants
  const showEmptyRow = dataRow.length > 0 && dataRow.length < 10;


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
              <th>Rank</th>
              <th>Merchant Name</th>
              <SortableHeader label="Total Volume" onSort={onSort} sortKey="volume" currentSortKey={currentSortKey}/>
              <SortableHeader label="Total Amount (MYR)" onSort={onSort} sortKey="amount" currentSortKey={currentSortKey}/>
            </tr>
          </thead>
          <tbody>
            {/**Render real rows */}
            {dataRow.map((merchant, rank) => (
              <tr key={merchant.id}>
                <td className="id-cell">{rank+1}</td>
                <td>{merchant.merchant}</td>
                <td className="amount-cell">{merchant.volume.toLocaleString()}</td>
                <td className="amount-cell">{formatCurrency(merchant.amount)}</td>
              </tr>
            ))}

            {/*Render empty row if there not enough top 10
            {showEmptyRow &&(
              <tr>
                <td colSpan="4" className="no-data-cell">No Transaction Available</td>
              </tr>
              )}*/}

            {/**Render "NO DATA" if data is 0*/}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan="4" className="no-data-cell">No Transaction Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ChartWrapper>
  );
}

export default MerchantTable;

