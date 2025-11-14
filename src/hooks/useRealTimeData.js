// Custom hook for data polling (real-time simulation)
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { fetchDashboardDataThunk } from "../state/dashboardSlice";

const POLLING_INTERVAL = 180000; // Poll every 3min
const DEFAULT_DATA_STRUCTURE = {
  hourlyTrend: [],
  topTickets: [],
  topMerchants: [],
  timestamp: null,
};

export const useRealTimeData = () => {
  const dispatch = useAppDispatch();

  // Pull state directly from Redux
  const { data, loading, error, filters } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const updateData = () => {
      // Dispatch the Redux THUNK, triggering the API call and state update
      dispatch(fetchDashboardDataThunk(filters));
    };

    updateData(); // Initial fetch

    // Set up the interval for continuous polling
    const intervalId = setInterval(updateData, POLLING_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [dispatch, filters]);

  // CRITICAL FIX: Merge the received data with the safe default structure.
  const initializedData = {
    ...DEFAULT_DATA_STRUCTURE,
    ...(data || {}),
  };

  // Return state managed by Redux
  return { data: initializedData, loading, error, filters };
};
