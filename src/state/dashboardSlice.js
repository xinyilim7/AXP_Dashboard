// Hold logic and definition
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardData } from "../api/mockApi";

// Get today's info
const now = new Date();
const currentDayOfWeek = now.getUTCDay(); //0-Mon, 6-Sun
const currentMonth = now.getUTCMonth(); // 0-Jan, 10-Nov
const currentDate = now.getUTCDate(); // 1-31

// Initial State
const initialState = {
  data: {
    hourlyTrend: [], // hold 24, 168, 720 data points
    topTickets: [],
    topMerchants: [],
    timestamp: null,
    categories: ["All"],
  },
  loading: "idle",
  error: null,
  filters: {
    dateRange: "Daily",
    selectedDayOfWeek: 0,
    selectedMonth: currentMonth,
    selectedDate: currentDate,
    ticketSortBy: "amount",
    ticketDateRange: "Daily",
    merchantSortBy: "amount",
    merchantDateRange: "Daily",
    paymentMethodDateRange: "Daily",
    paymentMethodSortBy: "volume",
  },
};

// Asynchronous thunk (API Caller)- handles the real-time polling logic
export const fetchDashboardDataThunk = createAsyncThunk(
  "dashboard.fetchData",
  async (filters, { rejectWithValue }) => {
    try {
      // Call mock API with current filters
      const response = await fetchDashboardData(filters);
      return response; // Data is passed to fulfilled case
    } catch (error) {
      // If API call fails, send the error message
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      state.filters.category = action.payload.category;
    },
    updateDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    updateTicketSort: (state, action) => {
      state.filters.ticketSortBy = action.payload;
    },
    updateTicketDateRange: (state, action) => {
      state.filters.ticketDateRange = action.payload;
    },
    updateMerchantSort: (state, action) => {
      state.filters.merchantSortBy = action.payload;
    },
    updateMerchantDateRange: (state, action) => {
      state.filters.merchantDateRange = action.payload;
    },
    updatePaymentMethodDateRange: (state, action) => {
      state.filters.paymentMethodDateRange = action.payload;
    },
    updatePaymentMethodSortBy: (state, action) => {
      state.filters.paymentMethodSortBy = action.payload;
    },
    updateSelectedDay: (state, action) => {
      if (state.filters.dateRange === "Weekly") {
        state.filters.selectedDayOfWeek = action.payload;
      } else if (state.filters.dateRange === "Monthly") {
        state.filters.selectedDate = action.payload;
      }
    },
    updateSelectedMonth: (state, action) => {
      const newMonth = action.payload;
      const currentDate = state.filters.selectedDate;
      const year = new Date().getUTCFullYear();
      const daysInNewMonth = new Date(year, newMonth + 1, 0).getUTCDate();

      state.filters.selectedMonth = newMonth;
      if (currentDate > daysInNewMonth) {
        state.filters.selectedDate = daysInNewMonth;
      }
    },
  },
  // Extra Reducers for handling the asynchronous thunk lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardDataThunk.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchDashboardDataThunk.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload; // update all data with new payload
      })
      .addCase(fetchDashboardDataThunk.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

// Export sync actions and the main thunk
export const {
  updateFilter,
  updateDateRange,
  updateTicketSort,
  updateSelectedDay,
  updateSelectedMonth,
  updateTicketDateRange,
  updateMerchantSort,
  updateMerchantDateRange,
  updatePaymentMethodDateRange,
  updatePaymentMethodSortBy,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
