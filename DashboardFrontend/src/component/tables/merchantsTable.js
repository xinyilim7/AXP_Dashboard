// Table component for feature #3
import ChartWrapper from "../charts/chartWrapper";
import "../dashboardLayout.css";
import {ArrowDown} from "lucide-react";

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
      {isActive && <ArrowDown size={20} style={{ marginLeft: '10px'}}/>}
    </th>
  );
};

export function MerchantTable({ data, loading, error, title, headerActions, icon, onSort, currentSortKey}) {
  const isInitialLoading = loading && (!data || data.length === 0);

  // Check if data has at least one row but fewer than 10 rows
  const dataRow = data ? data.slice(0,10) : []; 

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
      headerActions={headerActions}
    >
      <div className="merchant-table">
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
            {dataRow.map((merchant, rank) => (
              <tr key={merchant.id}>
                <td className="id-cell">{rank+1}</td>
                <td>{merchant.merchant}</td>
                <td className="amount-cell">{merchant.volume.toLocaleString()}</td>
                <td className="amount-cell">{formatCurrency(merchant.amount)}</td>
              </tr>
            ))}

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

