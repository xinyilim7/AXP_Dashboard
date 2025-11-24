import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dashboard";

export async function fetchDashboardData(filters) {
  try {
    // 1. Prepare requests
    const trendRequest = axios.get(`${API_BASE_URL}/trends`, {
      params: {
        dateRange: filters.dateRange || "Daily",
      },
    });
    const ticketRequest = axios.get(`${API_BASE_URL}/tickets`, {
      params: {
        dateRange: filters.ticketDateRange || "Daily",
        sortBy: filters.ticketSortBy || "amount",
      },
    });
    const merchantRequest = axios.get(`${API_BASE_URL}/merchants`, {
      params: {
        dateRange: filters.merchantDateRange || "Daily",
        sortBy: filters.merchantSortBy || "amount",
      },
    });
    const paymentRequest = axios.get(`${API_BASE_URL}/payments`, {
      params: {
        dateRange: filters.paymentMethodDateRange || "Daily",
        sortBy: filters.paymentMethodSortBy || "volume",
      },
    });

    // 2. Fire all requests at the same time
    const [trendResponse, ticketResponse, merchantResponse, paymentResponse] =
      await Promise.all([
        trendRequest,
        ticketRequest,
        merchantRequest,
        paymentRequest,
      ]);

    // 3. Combine results into one object for Redux
    return {
      hourlyTrend: trendResponse.data,
      topTickets: ticketResponse.data,
      topMerchants: merchantResponse.data,
      topPaymentMethods: paymentResponse.data,

      timestamp: new Date().toLocaleTimeString(),
      categories: ["All"],
      loading: false,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      hourlyTrend: [],
      topTickets: [],
      topMerchants: [],
      topPaymentMethods: [],
      timestamp: null,
      loading: false,
      error: "Failed to connect to server.",
    };
  }
}
