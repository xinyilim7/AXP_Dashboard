import React from "react";
import "./dashboardLayout.css";
import {
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  BanknoteArrowUp,
  Star,
  BadgeDollarSign,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { TrendChart } from "./charts/trendChart";
import { TicketSizeTable } from "./tables/ticketSizeTable";
import { MerchantTable } from "./tables/merchantsTable";
import { PaymentMethodChart } from "./charts/paymentChart";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { TotalStatusPieChart } from "./charts/totalStatusPieChart";
import {
  updateDateRange,
  updateTicketSort,
  updateTicketDateRange,
  updateMerchantSort,
  updateMerchantDateRange,
  updatePaymentMethodDateRange,
  updatePaymentMethodSortBy,
  fetchDashboardDataThunk,
} from "../state/dashboardSlice";

function MerchantDateRangeFilter({ currentRange, onRangeChange }) {
  const ranges = ["Daily", "Weekly", "Monthly"];
  const handleRangeChange = (range) => {
    onRangeChange(range);
  };
  return (
    <div className="date-range-filter">
      {ranges.map((range) => (
        <button
          key={range}
          className={`range-button ${currentRange === range ? "active" : ""}`}
          onClick={() => handleRangeChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

function MerchantSortFilter() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(
    (state) => state.dashboard.filters.merchantSortBy
  );
  const handleSortChange = (e) => {
    dispatch(updateMerchantSort(e.target.value));
  };

  return (
    <div className="category-filter">
      <label htmlFor="merchant-sort" className="sr-only">
        Sort By
      </label>
      <select
        id="merchant-sort"
        className="secondary-filter-select"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="amount">Amount</option>
        <option value="volume">Volume</option>
      </select>
    </div>
  );
}

function PaymentDateRangeFilter({ currentRange, onRangeChange }) {
  const ranges = ["Daily", "Weekly", "Monthly"];
  const handleRangeChange = (range) => {
    onRangeChange(range);
  };
  return (
    <div className="date-range-filter">
      {ranges.map((range) => (
        <button
          key={range}
          className={`range-button ${currentRange === range ? "active" : ""}`}
          onClick={() => handleRangeChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

function PaymentSortFilter() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(
    (state) => state.dashboard.filters.paymentMethodSortBy
  );
  const handleSortChange = (e) => {
    dispatch(updatePaymentMethodSortBy(e.target.value));
  };

  return (
    <div className="category-filter">
      <label htmlFor="payment-sort" className="sr-only">
        Sort By
      </label>
      <select
        id="payment-sort"
        className="secondary-filter-select"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="volume">Volume</option>
        <option value="amount">Amount</option>
      </select>
    </div>
  );
}

function DateRangeFilter({ currentRange, onRangeChange }) {
  const ranges = ["Daily", "Weekly", "Monthly"];
  const handleRangeChange = (range) => {
    onRangeChange(range);
  };
  return (
    <div className="date-range-filter">
      {ranges.map((range) => (
        <button
          key={range}
          className={`range-button ${currentRange === range ? "active" : ""}`}
          onClick={() => handleRangeChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

function TicketSortFilter() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(
    (state) => state.dashboard.filters.ticketSortBy
  );
  const handleSortChange = (e) => {
    dispatch(updateTicketSort(e.target.value));
  };

  return (
    <div className="category-filter">
      <label htmlFor="ticket-sort" className="sr-only">
        Sort By
      </label>
      <select
        id="ticket-sort"
        className="secondary-filter-select"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="amount">Amount</option>
        <option value="timestamp">Timestamp</option>
      </select>
    </div>
  );
}

function TicketDateRangeFilter({ currentRange }) {
  const dispatch = useAppDispatch();
  const ranges = ["Daily", "Weekly", "Monthly"];
  const handleRangeChange = (range) => {
    dispatch(updateTicketDateRange(range));
  };

  return (
    <div className="date-range-filter">
      {ranges.map((range) => (
        <button
          key={range}
          className={`range-button ${currentRange === range ? "active" : ""}`}
          onClick={() => handleRangeChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

export function DashboardLayout() {
  const companyName = "Axai Digital";
  const websiteTitle = "Real-Time Dashboard";
  const companyLogo = "/axaipay.svg";

  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector(
    (state) => state.dashboard
  );
  const displayData = data || {};

  // X-Axis Logic
  let xAxisKey;
  if (filters.dateRange === "Daily") {
    xAxisKey = "minute";
  } else {
    xAxisKey = "label";
  }

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleScrollTo = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  const handleMerchantSort = (sortKey) => {
    dispatch(updateMerchantSort(sortKey));
  };

  /* Auto-refresh data every 5s */
  React.useEffect(() => {
    const fetchData = () => {
      console.log("⚡ Polling data from Backend...");
      dispatch(fetchDashboardDataThunk(filters));
    };
    // 1. Fetch immediately
    fetchData();
    // 2. Set interval
    const intervalId = setInterval(fetchData, 5000);
    // 3. Cleanup
    return () => clearInterval(intervalId);
  }, [dispatch, filters]); // Re-run when filters change

  return (
    <div>
      {/* --- 1. HEADER (Company Name, Title, Update Status) --- */}
      <header className="dashboard-header">
        <div>
          <h1>{websiteTitle}</h1>
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
        </div>

        {/* Timestamp, Theme, Naviagtor*/}
        <div className="header-actions">
          <span className="text-sm">
            Last Update:{" "}
            <span className="font-semibold">
              {displayData.timestamp || "Initial Fetch"}
            </span>
          </span>

          <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            title={`${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon size={20} strokeWidth={2.2} />
            ) : (
              <Sun size={20} strokeWidth={2.2} />
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="hamburger-button"
            title="Open Navigation"
          >
            <Menu size={24} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* --- NAVIGATION OVERLAY & MENU --- */}
      <div
        className={`nav-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-header">
          <h3>Navigation</h3>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="nav-close-button"
            title="Close Menu"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="nav-links">
          <li>
            <button
              onClick={() => handleScrollTo("section-trends")}
              className="nav-link"
            >
              Transaction Trends
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollTo("section-tickets")}
              className="nav-link"
            >
              Top Ticket Sizes
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollTo("section-merchants")}
              className="nav-link"
            >
              Top Merchants
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollTo("section-payments")}
              className="nav-link"
            >
              Top Payment Methods
            </button>
          </li>
        </ul>
      </nav>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <main className="dashboard-main">
        <div className="dashboard-card">
          <div id="section-trends" className="chart-row">
            <div className="chart-one">
              <TrendChart
                data={displayData.hourlyTrend || []}
                loading={loading}
                error={error}
                icon={<TrendingUp size={35} color="#ff3b30" />}
                dateRange={filters.dateRange}
                headerActions={
                  <div className="trend-header-controls">
                    <DateRangeFilter
                      currentRange={filters.dateRange}
                      className="date-range-filter"
                      onRangeChange={(range) =>
                        dispatch(updateDateRange(range))
                      }
                    />
                  </div>
                }
              />
            </div>
            <div className="chart-two">
              <TotalStatusPieChart
                data={displayData.hourlyTrend}
                loading={loading}
                error={error}
                icon={<ChartNoAxesColumnIncreasing size={35} color="#ff3b30" />}
              />
            </div>
          </div>
          {/**Top 10 Ticket Size */}
          <div id="section-tickets">
            <TicketSizeTable
              data={displayData.topTickets}
              loading={loading}
              error={error}
              icon={<BanknoteArrowUp size={35} color="#ff3b30" />}
              onSort={(sortKey) => dispatch(updateTicketSort(sortKey))}
              currentSortKey={filters.ticketSortBy}
              title={`Top 10 Ticket Sizes (${filters.ticketDateRange})`}
              headerActions={
                <div className="ticket-header-controls">
                  <TicketDateRangeFilter
                    currentRange={filters.ticketDateRange}
                  />
                  <TicketSortFilter />
                </div>
              }
            />
          </div>

          {/**Top 10 Merchant */}
          <div id="section-merchants" className="table-container">
            <div>
              <MerchantTable
                title={`Top 10 Merchants (${filters.merchantDateRange})`}
                data={displayData.topMerchants}
                loading={loading}
                error={error}
                icon={<Star size={35} color="#ff3b30" />}
                onSort={handleMerchantSort}
                currentSortKey={filters.merchantSortBy}
                headerActions={
                  <div className="ticket-header-controls">
                    <MerchantDateRangeFilter
                      currentRange={filters.merchantDateRange}
                      onRangeChange={(range) =>
                        dispatch(updateMerchantDateRange(range))
                      }
                    />
                    <MerchantSortFilter />
                  </div>
                }
              />
            </div>
          </div>

          {/**Top 10 Payment Methods */}
          <div id="section-payments" className="table-container">
            <div>
              <PaymentMethodChart
                title={`Top 5 Payment Methods (${filters.paymentMethodDateRange})`}
                data={displayData.topPaymentMethods}
                loading={loading}
                error={error}
                icon={<BadgeDollarSign size={35} color="#ff3b30" />}
                currentSortKey={filters.paymentMethodSortBy}
                headerActions={
                  <div className="ticket-header-controls">
                    <PaymentDateRangeFilter
                      currentRange={filters.paymentMethodDateRange}
                      onRangeChange={(range) =>
                        dispatch(updatePaymentMethodDateRange(range))
                      }
                    />
                    <PaymentSortFilter />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </main>

      {/* --- 3. FOOTER --- */}
      <footer className="dashboard-footer">
        &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
      </footer>
    </div>
  );
}
