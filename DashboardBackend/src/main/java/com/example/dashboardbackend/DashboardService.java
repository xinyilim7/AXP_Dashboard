//package com.example.dashboardbackend;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class DashboardService {
//    @Autowired
//    private DashboardRepository repository; // Link to DB
//
//    // 1. Trend Data---
//    public List<Map<String, Object>> getTrendData(String dateRange){
//        List<Transaction> allEvents = repository.findAll();
//        List<Transaction> filtered = filterEvents(allEvents,dateRange);
//
//        if("Daily".equalsIgnoreCase(dateRange)){
//            return aggregateHourlyTrend(filtered);
//        }else if("Weekly".equalsIgnoreCase(dateRange)){
//            return aggregateWeeklyTrend(filtered);
//        }else {
//            return aggregateMonthlyTrend(filtered);
//        }
//    }
//
//    // 2. Ticket Data---
//    public List<Transaction> getTopTickets(String dateRange, String sortBy){
//        List<Transaction> allEvents = repository.findAll();
//        List<Transaction> filtered = filterEvents(allEvents,dateRange);
//        return calculateTopTickets(filtered,sortBy);
//    }
//
//    // 3. Merchant Data---
//    public List<Map<String,Object>> getTopMerchants(String dateRange, String sortBy){
//        List<Transaction> allEvents = repository.findAll();
//        List<Transaction> filtered = filterEvents(allEvents,dateRange);
//        return calculateTopMerchants(filtered,sortBy);
//    }
//
//    // 4. Payment Methods Data---
//    public List<Map<String,Object>> getTopPaymentMethods(String dateRange, String sortBy){
//        List<Transaction> allEvents = repository.findAll();
//        List<Transaction> filtered = filterEvents(allEvents,dateRange);
//        return calculateTopPaymentMethods(filtered,sortBy);
//    }
//
//    /*Date Filtering*/
//    private List<Transaction> filterEvents(List<Transaction> events, String range) {
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime start;
//
//        if (range.equalsIgnoreCase("Daily")) {
//            start = now.withHour(0).withMinute(0).withSecond(0);
//        } else if (range.equalsIgnoreCase("Weekly")) {
//            // DEFAULT = 1 Mon 7 Sun
//            start = now.withHour(0).withMinute(0).withSecond(0);
//            int daysToSubtract = start.getDayOfWeek().getValue() - 1; // Mon-0
//            start = start.minusDays(daysToSubtract);
//        } else {
//            start = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
//        }
//
//        final LocalDateTime effectiveStart = start;
//
//        return events.stream()
//                .filter(e -> e.getTimestamp().isAfter(effectiveStart) || e.getTimestamp().isEqual(effectiveStart))
//                .collect(Collectors.toList());
//    }
//
//    /*Daily Trend*/
//    private List<Map<String, Object>> aggregateHourlyTrend(List<Transaction> events) {
//        // 1. Debugging: Check if data is actually arriving here
//        System.out.println("AggregateHourlyTrend received " + events.size() + " transactions.");
//
//        // 2. Create 1440 buckets (00:00 to 23:59)
//        List<Map<String, Object>> buckets = new ArrayList<>();
//        for(int h=0; h<24; h++) {
//            String hStr = String.format("%02d", h);
//            for(int m=0; m<60; m++) {
//                Map<String, Object> bucket = new HashMap<>();
//                bucket.put("minute", String.format("%s:%02d", hStr, m));
//                bucket.put("success", 0);
//                bucket.put("failed", 0);
//                bucket.put("pending", 0);
//                bucket.put("total", 0);
//                buckets.add(bucket);
//            }
//        }
//
//        // 3. Fill buckets
//        for(Transaction t : events) {
//            int index = t.getTimestamp().getHour() * 60 + t.getTimestamp().getMinute();
//
//            // Safety check: Ensure index is valid
//            if (index >= 0 && index < buckets.size()) {
//                Map<String, Object> bucket = buckets.get(index);
//
//                // Convert status to lowercase to match your map keys ("success", "failed")
//                String status = t.getStatus().toLowerCase();
//
//                // Safe update: Use getOrDefault to prevent crashes if status is unknown
//                if (bucket.containsKey(status)) {
//                    bucket.put(status, (int) bucket.get(status) + 1);
//                }
//
//                bucket.put("total", (int) bucket.get("total") + 1);
//            }
//        }
//        return buckets;
//    }
//    /*Weekly Trend*/
//    private List<Map<String, Object>> aggregateWeeklyTrend(List<Transaction> events) {
//        String[] days ={"Mon","Tue","Wed","Thu","Fri","Sat","Sun"};
//        List<Map<String, Object>> buckets = new ArrayList<>();
//
//        for(String day : days) {
//            Map<String, Object> bucket = new HashMap<>();
//            bucket.put("label", day);
//            bucket.put("success",0);
//            bucket.put("failed",0);
//            bucket.put("pending",0);
//            bucket.put("total",0);
//            buckets.add(bucket);
//        }
//
//        for(Transaction t : events) {
//            int index = t.getTimestamp().getDayOfWeek().getValue() - 1;
//            Map<String, Object> bucket = buckets.get(index);
//
//            String status = t.getStatus();
//            bucket.put(status, (int)bucket.get(status)+1);
//            bucket.put("total", (int) bucket.get("total")+1);
//        }
//        return buckets;
//    }
//
//    /*Monthly Trend*/
//    private List<Map<String, Object>> aggregateMonthlyTrend(List<Transaction> events) {
//        // 1. Get current date info
//        LocalDate now = LocalDate.now();
//        int year = now.getYear();
//        int month = now.getMonthValue(); // 1-12
//        int daysInMonth = now.lengthOfMonth(); // e.g., 30 for Nov
//
//        // 2. Create buckets (One for each day of the month)
//        List<Map<String, Object>> buckets = new ArrayList<>();
//        for(int i = 1; i <= daysInMonth; i++) {
//            Map<String, Object> bucket = new HashMap<>();
//            // Create label "01", "02", etc.
//            bucket.put("label", (i < 10 ? "0" + i : String.valueOf(i)));
//            bucket.put("success", 0);
//            bucket.put("failed", 0);
//            bucket.put("total", 0);
//            buckets.add(bucket);
//        }
//
//        // 3. Loop through events
//        for(Transaction t : events) {
//            // Only process events in the current month/year
//            LocalDateTime timestamp = t.getTimestamp();
//            if(timestamp.getYear() == year && timestamp.getMonthValue() == month) {
//
//                int day = timestamp.getDayOfMonth(); // 1-31
//                int bucketIndex = day - 1; // 0-30
//
//                // Safety Check: Ensure index is valid
//                if(bucketIndex >= 0 && bucketIndex < buckets.size()) {
//                    Map<String, Object> bucket = buckets.get(bucketIndex);
//
//                    if("success".equalsIgnoreCase(t.getStatus())) {
//                        bucket.put("success", (int)bucket.get("success") + 1);
//                    } else if("failed".equalsIgnoreCase(t.getStatus())) {
//                        bucket.put("failed", (int)bucket.get("failed") + 1);
//                    }
//                    bucket.put("total", (int)bucket.get("total") + 1);
//                }
//            }
//        }
//        return buckets;
//    }
//    /*Calculate Top 10 Ticket*/
//    private List<Transaction> calculateTopTickets(List<Transaction> t, String sortBy) {
//        Comparator<Transaction> comparator;
//
//        if("timestamp".equalsIgnoreCase(sortBy)){
//            // Sort by Timestamp (Newest first)
//            comparator = Comparator.comparing(Transaction::getTimestamp).reversed();
//        }else{
//            // Sort by Amount (Highest first)
//            comparator = Comparator.comparing(Transaction::getAmount).reversed();
//        }
//
//        return t.stream().sorted(comparator).limit(10).collect(Collectors.toList());
//    }
//
//    /*Calculate Top 10 Merchants*/
//    private List<Map<String, Object>> calculateTopMerchants(List<Transaction> transaction, String sortBy) {
//        //1. Group by merchant name
//        Map<String,Map<String,Object>> stats = new HashMap<>();
//
//        for(Transaction t : transaction){
//            // Only successful transaction for merchants
//            if(!"success".equalsIgnoreCase(t.getStatus())) continue;
//            // Initialize if key doesn't exist
//            stats.putIfAbsent(t.getMerchant(), new HashMap<>(Map.of(
//                    "merchant", t.getMerchant(),
//                    "amount", 0.0,
//                    "volume", 0
//            )));
//
//            // Update Value
//            Map<String,Object> merchantData = stats.get(t.getMerchant());
//            merchantData.put("amount", (double)merchantData.get("amount")+t.getAmount());
//            merchantData.put("volume", (int)merchantData.get("volume")+1);
//        }
//
//        // 2. Convert Map to List
//        List<Map<String, Object>> resultList = new ArrayList<>(stats.values());
//
//        // 3. Filtering
//        Comparator<Map<String, Object>> comparator;
//        if("volume".equalsIgnoreCase(sortBy)){
//            comparator = (m1, m2)->Integer.compare((int)m2.get("volume"),(int)m1.get("volume"));
//        }else {
//            comparator = (m1, m2)->Double.compare((double)m2.get("amount"),(double) m1.get("amount"));
//        }
//
//        // 4. Return
//        return resultList.stream().sorted(comparator).limit(10).collect(Collectors.toList());
//    }
//
//    /*Calculate Top 5 Payment Methods*/
//    private List<Map<String, Object>> calculateTopPaymentMethods(List<Transaction> transaction, String sortBy) {
//        // 1. Group by category
//        Map<String,Map<String, Object>> stats = new HashMap<>();
//
//        for(Transaction t : transaction){
//            // Only count success case
//            if(!"success".equalsIgnoreCase(t.getStatus())) continue;
//            // Initialize if key doesn't exist
//            stats.putIfAbsent(t.getCategory(), new HashMap<>(Map.of(
//                    "id", t.getCategory(),
//                    "category", t.getCategory(),
//                    "amount", 0.0,
//                    "volume", 0
//            )));
//
//            // Update Value
//            Map<String,Object> methodData = stats.get(t.getCategory());
//            methodData.put("amount", (double) methodData.get("amount")+t.getAmount());
//            methodData.put("volume", (int)methodData.get("volume")+1);
//        }
//
//        // 2. Convert Map to List
//        List<Map<String, Object>> resultList = new ArrayList<>(stats.values());
//
//        // 3. Sort based on filter
//        Comparator<Map<String, Object>> comparator;
//        if("volume".equalsIgnoreCase(sortBy)){
//            comparator=(m1, m2)->Integer.compare((int)m2.get("volume"),(int)m1.get("volume"));
//        }else{
//            comparator=(m1,m2)->Double.compare((double)m2.get("amount"),(double) m1.get("amount"));
//        }
//
//        // 4. Return
//        return resultList.stream().sorted(comparator).limit(5).collect(Collectors.toList());
//    }
//
//
//}
//
//
//

package com.example.dashboardbackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.awt.geom.Arc2D;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private DashboardRepository repository; // Link to DB

    //==================================================================
    // PUBLIC METHOD (CALL BY CONTROLLER)
    //==================================================================
    // 1. Trend Data---
    public List<Map<String, Object>> getTrendData(String dateRange) {
        LocalDateTime start = getStartDate(dateRange);
        // Get raw data for trends to handle time bucket in java
        List<Transaction> filtered = repository.findByTimestampAfter(start);

        if ("Daily".equalsIgnoreCase(dateRange)) {
            return aggregateHourlyTrend(filtered);
        } else if ("Weekly".equalsIgnoreCase(dateRange)) {
            return aggregateWeeklyTrend(filtered);
        } else {
            return aggregateMonthlyTrend(filtered);
        }
    }

    // 2. Ticket Data---
    public List<Transaction> getTopTickets(String dateRange, String sortBy) {
        LocalDateTime start = getStartDate(dateRange);
        if ("timestamp".equalsIgnoreCase(sortBy)) {
            return repository.findTop10ByTimestampAfterOrderByTimestampDesc(start);
        } else {
            return repository.findTop10ByTimestampAfterOrderByAmountDesc(start);
        }
    }

    // 3. Merchant Data---
    public List<Map<String, Object>> getTopMerchants(String dateRange, String sortBy) {
        LocalDateTime start = getStartDate(dateRange);
        List<Object[]> rawStats = repository.findMerchantStats(start);
        return processAndSortStats(rawStats, sortBy, 10, "merchant");
    }

    // 4. Payment Methods Data---
    public List<Map<String, Object>> getTopPaymentMethods(String dateRange, String sortBy) {
        LocalDateTime start = getStartDate(dateRange);
        List<Object[]> rawStats = repository.findPaymentMethodStats(start);
        return processAndSortStats(rawStats, sortBy, 5, "category");
    }


    //==================================================================
    // HELPER METHOD
    //==================================================================
    /*Date Filtering*/
    private LocalDateTime getStartDate(String dateRange) {
        LocalDateTime now = LocalDateTime.now();
        if ("Daily".equalsIgnoreCase(dateRange)) {
            return now.withHour(0).withMinute(0).withSecond(0);
        } else if ("Weekly".equalsIgnoreCase(dateRange)) {
            return now.minusDays(7).withHour(0).withMinute(0).withSecond(0);
        } else {
            return now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        }
    }

    /*Daily Trend*/
    private List<Map<String, Object>> aggregateHourlyTrend(List<Transaction> events) {
        // 1. Debugging: Check if data is actually arriving here
        System.out.println("AggregateHourlyTrend received " + events.size() + " transactions.");
        // 2. Create 1440 buckets (00:00 to 23:59)
        List<Map<String, Object>> buckets = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            String hStr = String.format("%02d", h);
            for (int m = 0; m < 60; m++) {
                Map<String, Object> bucket = new HashMap<>();
                bucket.put("minute", String.format("%s:%02d", hStr, m));
                bucket.put("success", 0);
                bucket.put("failed", 0);
                bucket.put("pending", 0);
                bucket.put("total", 0);
                buckets.add(bucket);
            }
        }
        // 3. Fill buckets
        for (Transaction t : events) {
            int index = t.getTimestamp().getHour() * 60 + t.getTimestamp().getMinute();
            if (index >= 0 && index < buckets.size()) {
                Map<String, Object> bucket = buckets.get(index);

                // Convert status to lowercase to match your map keys ("success", "failed")
                String status = t.getStatus().toLowerCase();

                // Safe update: Use getOrDefault to prevent crashes if status is unknown
                if (bucket.containsKey(status)) {
                    bucket.put(status, (int) bucket.get(status) + 1);
                }
                bucket.put("total", (int) bucket.get("total") + 1);
            }
        }
        return buckets;
    }

    /*Weekly Trend*/
    private List<Map<String, Object>> aggregateWeeklyTrend(List<Transaction> events) {
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        List<Map<String, Object>> buckets = new ArrayList<>();

        for (String day : days) {
            Map<String, Object> bucket = new HashMap<>();
            bucket.put("label", day);
            bucket.put("success", 0);
            bucket.put("failed", 0);
            bucket.put("pending", 0);
            bucket.put("total", 0);
            buckets.add(bucket);
        }

        for (Transaction t : events) {
            int index = t.getTimestamp().getDayOfWeek().getValue() - 1;
            Map<String, Object> bucket = buckets.get(index);

            String status = t.getStatus();
            bucket.put(status, (int) bucket.get(status) + 1);
            bucket.put("total", (int) bucket.get("total") + 1);
        }
        return buckets;
    }

    /*Monthly Trend*/
    private List<Map<String, Object>> aggregateMonthlyTrend(List<Transaction> events) {
        // 1. Get current date info
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue(); // 1-12
        int daysInMonth = now.lengthOfMonth(); // e.g., 30 for Nov

        // 2. Create buckets (One for each day of the month)
        List<Map<String, Object>> buckets = new ArrayList<>();
        for (int i = 1; i <= daysInMonth; i++) {
            Map<String, Object> bucket = new HashMap<>();
            // Create label "01", "02", etc.
            bucket.put("label", (i < 10 ? "0" + i : String.valueOf(i)));
            bucket.put("success", 0);
            bucket.put("failed", 0);
            bucket.put("total", 0);
            buckets.add(bucket);
        }

        // 3. Loop through events
        for (Transaction t : events) {
            // Only process events in the current month/year
            LocalDateTime timestamp = t.getTimestamp();
            if (timestamp.getYear() == year && timestamp.getMonthValue() == month) {

                int day = timestamp.getDayOfMonth(); // 1-31
                int bucketIndex = day - 1; // 0-30

                // Safety Check: Ensure index is valid
                if (bucketIndex >= 0 && bucketIndex < buckets.size()) {
                    Map<String, Object> bucket = buckets.get(bucketIndex);

                    if ("success".equalsIgnoreCase(t.getStatus())) {
                        bucket.put("success", (int) bucket.get("success") + 1);
                    } else if ("failed".equalsIgnoreCase(t.getStatus())) {
                        bucket.put("failed", (int) bucket.get("failed") + 1);
                    }
                    bucket.put("total", (int) bucket.get("total") + 1);
                }
            }
        }
        return buckets;
    }

    /*Generic helper to convert SQL results to Map and Sort*/
    private List<Map<String, Object>> processAndSortStats(List<Object[]> rawStats, String sortBy, int limit, String keyName) {
        List<Map<String, Object>> results = rawStats.stream().map(row ->{
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);
            map.put(keyName, row[0]);
            map.put("amount", row[1]);
            map.put("volume", row[2]);

            return map;
        }).collect(Collectors.toList());

        Comparator<Map<String,Object>> comparator;
        if ("volume".equalsIgnoreCase(sortBy)) {
            comparator=((m1, m2) -> Long.compare((Long) m2.get("volume"), (Long) m1.get("volume")));
        }else{
            comparator=((m1, m2) -> Double.compare((Double) m2.get("amount"), (Double) m1.get("amount")));
        }
        return results.stream().sorted(comparator).limit(limit).collect(Collectors.toList());
    }
}



