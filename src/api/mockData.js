import { aggregateHourlyTrend } from "../utils/dataFormatter.js";

function generateHourlyEvents() {
  const events = [];
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

  const now = new Date();
  const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 5000; i++) {
    const randomTime=now.getTime() - Math.floor(Math.random() * thirtyDaysInMilliseconds);
    const timestamp = new Date(randomTime);

    events.push({
      id: `T${i + 1}`,
      timestamp: timestamp.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: parseFloat((Math.random() * 1000 + 5).toFixed(2)),
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }

  return events;
}

//Generate base transaction data once
export const rawTransactionEvents = generateHourlyEvents();
//Generate base hourly trend data once
export const hourlyTrendData = aggregateHourlyTrend(rawTransactionEvents);

//Feature 2: Top 10 Ticket Size
export const topTicketData = rawTransactionEvents
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 10);