import { rawTransactionEvents } from "./mockData.js";
import {
  aggregateHourlyTrend,
  aggregateWeeklyTrend,
  aggregateMonthlyTrend,
} from "../utils/dataFormatter.js";
import { updatePaymentMethodDateRange } from "../state/dashboardSlice.js";

const API_LATENCY = 300;
let newTransactionCounter = 1;

function getHourKey(date) {
  const hour = date.getUTCHours();
  return `${hour < 10 ? "0" : ""}${hour}:00`;
}

const now = new Date();
const startOfToday = new Date(new Date().setUTCHours(0, 0, 0, 0));
const startOfWeek = new Date(startOfToday);
const dayOfWeek = startOfToday.getUTCDay(); // 0=Sun, 1=Mon
// const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // if Sun(0), go back 6 days
// startOfWeek.setUTCDate(startOfToday.getUTCDate() - diff);
startOfWeek.setUTCDate(startOfToday.getUTCDate() - startOfToday.getUTCDay());
const startOfMonth = new Date(startOfToday);
startOfMonth.setUTCDate(1);

function isToday(date) {
  return date >= startOfToday;
}

function isThisWeek(date) {
  return date >= startOfWeek;
}

function isThisMonth(date) {
  return date >= startOfMonth;
}

function simulateNewTransactions() {
  const now = new Date();
  const currentHourKey = getHourKey(now);

  // 1. Get "before" data for logging
  const oldHourlyTrend = aggregateHourlyTrend(rawTransactionEvents);
  const oldTrendForThisHour = oldHourlyTrend.find(
    (h) => h.hour === currentHourKey
  );

  // 2. Simulate 50 new transactions
  const numNewEvents = 50;
  const merchants = [
    "Gacha Nexus",
    "Infinite Play",
    "EverHydrate",
    "Kotaku",
    "MillionMinda",
    "DT Earth Bistrocafe",
    "BajuPrint",
    "Phonenest",
    "Joy Jungle",
    "Hamper Emporium",
    "ABC",
    "XYZ",
  ];
  const statuses = ["success", "failed", "pending", "success", "success"]; // 80% success
  const categories = [
    "RHB",
    "CIMB",
    "AiraPay",
    "Alipay+",
    "Boost",
    "DuitnowQR",
    "GrabPay",
    "MCash",
    "MobyPay",
    "Paydee",
    "Retailpay",
    "ShopeePay",
    "SPay",
    "SPayLater",
    "TnG",
    "UnionPay",
    "WannaPay",
    "WavPay",
    "Visa",
    "Mastercard",
    "FPX",
  ];

  let newSuccessCount = 0;
  let newFailedCount = 0;

  for (let i = 0; i < numNewEvents; i++) {
    const eventTimestamp = new Date();
    const now = new Date();

    eventTimestamp.setUTCHours(
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      i
    );

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    if (status === "success") newSuccessCount++;
    else newFailedCount++;

    const newEvent = {
      id: `N${newTransactionCounter}`,
      timestamp: eventTimestamp.toISOString(),
      status: status,
      amount: parseFloat((Math.random() * 1000 + 5).toFixed(2)),
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    };
    rawTransactionEvents.unshift(newEvent);
    newTransactionCounter++;
  }

  // 3. Re-calculate aggregates
  const newHourlyTrend = aggregateHourlyTrend(rawTransactionEvents);
  const newTopTickets = [...rawTransactionEvents]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  // 4. Log the changes
  const newTrendForThisHour = newHourlyTrend.find(
    (h) => h.hour === currentHourKey
  );

  // Checking
  console.log(`[Mock API @ ${now.toLocaleTimeString()}] --------------------`);
  console.log(
    `[Mock API] Added ${newSuccessCount} success, ${newFailedCount} failed events.`
  );
  console.log(
    `[Mock API] Hour ${currentHourKey} (Success): ${oldTrendForThisHour?.success} -> ${newTrendForThisHour?.success}`
  );
  console.log(
    `[Mock API] Hour ${currentHourKey} (Failed): ${oldTrendForThisHour?.failed} -> ${newTrendForThisHour?.failed}`
  );
  console.log(
    "[Mock API] New Top Ticket:",
    newTopTickets[0].merchant,
    newTopTickets[0].amount
  );
  console.log(`[Mock API] --------------------`);

  return { newTopTickets };
}

function calculateTopMerchants(events) {
  const merchantTotal = new Map();
  for (const event of events) {
    if (event.status === "success") {
      const current = merchantTotal.get(event.merchant) || {
        amount: 0,
        volume: 0,
      };
      merchantTotal.set(event.merchant, {
        amount: current.amount + event.amount,
        volume: current.volume + 1,
      });
    }
  }
  const aggregatedData = Array.from(merchantTotal, ([merchant, data]) => ({
    id: merchant,
    merchant,
    amount: data.amount,
    volume: data.volume,
  }));
  return aggregatedData.slice(0, 10); // We sort later
}

function calculateTopPaymentMethod(events) {
  const methodTotals = new Map();
  for (const event of events) {
    if (event.status === "success") {
      const current = methodTotals.get(event.category) || {
        amount: 0,
        volume: 0,
      };
      methodTotals.set(event.category, {
        amount: current.amount + event.amount,
        volume: current.volume + 1,
      });
    }
  }

  const aggregatedData = Array.from(methodTotals, ([category, data]) => ({
    id: category,
    category: category,
    amount: data.amount,
    volume: data.volume,
  }));

  return aggregatedData;
}


export async function fetchDashboardData(filters = {}) {
  await new Promise((resolve) => setTimeout(resolve, API_LATENCY));
  const {
    category,
    dateRange,
    ticketDateRange,
    ticketSortBy,
    merchantSortBy,
    merchantDateRange,
    paymentMethodSortBy,
    paymentMethodDateRange,
  } = filters;

  // 1. Simulate new transactions
  simulateNewTransactions();

  // // 2. Get data for line charts
  // const selectedDateEvents = getSelectedDateEvents(
  //   rawTransactionEvents,
  //   filters
  // );
  // const selectedDayHourlyTrend = aggregateHourlyTrend(selectedDateEvents);

  // 3. Get event lists by date range
  const dailyEvents = rawTransactionEvents.filter((e) =>
    isToday(new Date(e.timestamp))
  );
  const weeklyEvents = rawTransactionEvents.filter((e) =>
    isThisWeek(new Date(e.timestamp))
  );
  const monthlyEvents = rawTransactionEvents.filter((e) =>
    isThisMonth(new Date(e.timestamp))
  );

  let trendData;
  if (dateRange === "Daily") {
    trendData = aggregateHourlyTrend(dailyEvents);
  } else if (dateRange === "Weekly") {
    trendData = aggregateWeeklyTrend(weeklyEvents);
  } else {
    trendData = aggregateMonthlyTrend(monthlyEvents);
  }

  // 4. Get data for top 10 tickets
  let eventsForTickets;
  if (ticketDateRange === "Daily") {
    // Use the new ticketDateRange filter
    eventsForTickets = dailyEvents;
  } else if (ticketDateRange === "Weekly") {
    eventsForTickets = weeklyEvents;
  } else {
    // Monthly
    eventsForTickets = monthlyEvents;
  }

  let sortedTickets;
  if (ticketSortBy === "amount") {
    sortedTickets = [...eventsForTickets].sort((a, b) => b.amount - a.amount);
  } else {
    sortedTickets = [...eventsForTickets].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }
  const topTickets = sortedTickets.slice(0, 10);

  // 5. For merchant table
  let eventsForMerchants;
  if (merchantDateRange === "Daily") {
    eventsForMerchants = dailyEvents;
  } else if (merchantDateRange === "Weekly") {
    eventsForMerchants = weeklyEvents;
  } else {
    eventsForMerchants = monthlyEvents;
  }

  let topMerchants = calculateTopMerchants(eventsForMerchants);

  if (merchantSortBy === "volume") {
    topMerchants.sort((a, b) => b.volume - a.volume);
  } else {
    topMerchants.sort((a, b) => b.amount - a.amount);
  }
  topMerchants=topMerchants.slice(0,10);

  // 6. For payment chart
  let eventsForPaymentMethods;
  if (paymentMethodDateRange === "Daily") {
    eventsForPaymentMethods = dailyEvents;
  } else if (paymentMethodDateRange === "Weekly") {
    eventsForPaymentMethods = weeklyEvents;
  } else {
    eventsForPaymentMethods = monthlyEvents;
  }

  let topPaymentMethods = calculateTopPaymentMethod(eventsForPaymentMethods);

  if (paymentMethodSortBy === "volume") {
    topPaymentMethods.sort((a, b) => b.volume - a.volume);
  } else {
    topPaymentMethods.sort((a, b) => b.amount - a.amount);
  }

  topPaymentMethods = topPaymentMethods.slice(0, 5);

  // const allCategories = [
  //   "All",
  //   ...new Set(rawTransactionEvents.map((m) => m.category)),
  // ];

  return {
    hourlyTrend: trendData,
    topTickets: topTickets,
    topMerchants: topMerchants,
    topPaymentMethods:topPaymentMethods,
    timestamp: new Date().toLocaleTimeString(),
    loading: false,
  };
}
