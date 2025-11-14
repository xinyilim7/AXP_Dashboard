// Daily Aggregation of Transaction Events by Hour
export function aggregateHourlyTrend(events) {
  // 1. Create 24 buckets for each hour of day
  const buckets = [];

  for (let hour = 0; hour < 24; hour++) {
    const h = hour.toString().padStart(2, "0");
    for (let min = 0; min < 60; min++) {
      let m = min.toString().padStart(2, "0");
      buckets.push({
        minute: `${h}:${m}`,
        success: 0,
        failed: 0,
        pending: 0,
        total: 0,
      });
    }
  }

  for (const event of events) {
    const timestamp = new Date(event.timestamp);
    const hour = timestamp.getUTCHours();
    const minute = timestamp.getUTCMinutes();

    const bucketsIndex = hour * 60 + minute;

    if (event.status === "success") {
      buckets[bucketsIndex].success += 1;
    } else if (event.status === "failed") {
      buckets[bucketsIndex].failed += 1;
    } else if (event.status === "pending") {
      buckets[bucketsIndex].pending += 1;
    }
    buckets[bucketsIndex].total += 1;
  }

  return buckets;
}

// Weekly Aggregation of Transaction Events by Day
export function aggregateWeeklyTrend(events) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = [];

  for (const day of daysOfWeek) {
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min++) {
        const h = hour.toString().padStart(2, "0");
        const m = min.toString().padStart(2, "0");
        buckets.push({
          label: `${day} ${h}:${m}`, // Mon 00:00, Mon 00:01...
          success: 0,
          failed: 0,
          pending: 0,
          total: 0,
        });
      }
    }
  }

  for (const event of events) {
    const timestamp = new Date(event.timestamp);
    const dayIndex = (timestamp.getUTCDay() + 6) % 7; // 0-Mon, 6-Sun
    const hourIndex = timestamp.getUTCHours();
    const minuteIndex = timestamp.getUTCMinutes();

    const bucketsIndex = dayIndex * 24 * 60 + hourIndex * 60 + minuteIndex;

    if (bucketsIndex >= 0 && bucketsIndex < 10080) {
      if (event.status === "success") {
        buckets[bucketsIndex].success += 1;
      } else if (event.status === "failed") {
        buckets[bucketsIndex].failed += 1;
      } else if (event.status === "pending") {
        buckets[bucketsIndex].pending += 1;
      }
      buckets[bucketsIndex].total += 1;
    }
  }

  return buckets;
}

// Monthly Aggregation of Transaction Events by Day
export function aggregateMonthlyTrend(events) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
  const buckets = [];

  // 1. Create buckets for every minute of every day (e.g., 43,200 buckets)
  for (let day = 1; day <= daysInMonth; day++) {
    const d = day < 10 ? `0${day}` : `${day}`;
    for (let hour = 0; hour < 24; hour++) {
      const h = hour < 10 ? `0${hour}` : `${hour}`;
      for (let min = 0; min < 60; min++) {
        const m = min < 10 ? `0${min}` : `${min}`;
        buckets.push({
          label: `${d}/${month + 1} ${h}:${m}`, // e.g., "01/11 00:00"
          success: 0,
          failed: 0,
          pending: 0,
          total: 0,
        });
      }
    }
  }

  for (const event of events) {
    const timestamp = new Date(event.timestamp);

    // Only process events in the current month
    if (
      timestamp.getUTCMonth() === month &&
      timestamp.getUTCFullYear() === year
    ) {
      const dateIndex = timestamp.getUTCDate() - 1; // 0-29
      const hourIndex = timestamp.getUTCHours(); // 0-23
      const minuteIndex = timestamp.getUTCMinutes(); // 0-59

      const bucketsIndex = dateIndex * 24 * 60 + hourIndex * 60 + minuteIndex;

      // --- THIS IS THE FIX ---
      // Your old code was: daysInMonth * 24
      // It needed to be: daysInMonth * 24 * 60
      if (bucketsIndex >= 0 && bucketsIndex < daysInMonth * 24 * 60) {
        if (event.status === "success") {
          buckets[bucketsIndex].success += 1;
        } else if (event.status === "failed") {
          buckets[bucketsIndex].failed += 1;
        } else if (event.status === "pending") {
          buckets[bucketsIndex].pending += 1;
        }
        buckets[bucketsIndex].total += 1;
      }
    }
  }

  return buckets;
}
