//package com.example.dashboardbackend;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.scheduling.annotation.Scheduled;
//
//import java.time.LocalDateTime;
//import java.time.ZoneId;
//import java.util.Random;
//
//@Configuration
//@EnableAutoConfiguration
//public class TransactionSimulator {
//    @Autowired
//    private DashboardRepository repository;
//
//    private final Random random = new Random();
//    private final String[] merchants = { "Gacha Nexus", "Infinite Play", "EverHydrate", "Kotaku", "MillionMinda","DT Earth Bistrocafe", "BajuPrint", "Phonenest", "Joy Jungle", "Hamper Emporium", "ABC", "XYZ"};
//    private final String[] statuses ={"success", "success","success", "failed", "pending"};
//    private final String[] categories ={"RHB", "CIMB", "AiraPay", "Alipay+", "Boost", "DuitnowQR", "GrabPay", "MCash", "MobyPay", "Paydee", "Retailpay", "ShopeePay", "SPay", "SPayLater", "TnG", "UnionPay", "WannaPay", "WavPay", "Visa", "Mastercard", "FPX"};
//
//    // Run this every 5s-
//    @Scheduled(fixedRate = 5000)
//    public void simulateRealTimeTraffic() {
//        // Random amount
//        for(int i=0;i<500;i++) {
//            Transaction t = new Transaction();
//            double amount = 10 + (1000 -10) * random.nextDouble();
//            t.setAmount(Math.round(amount *100.0)/100.0);
//            // Random details
//            t.setMerchant(merchants[random.nextInt(merchants.length)]);
//            t.setStatus(statuses[random.nextInt(statuses.length)]);
//            t.setCategory(categories[random.nextInt(categories.length)]);
//
//            t.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Kuala_Lumpur")));
//            repository.save(t);
//
//            System.out.println(">>> New Transaction Generated: " + t.getTimestamp());
//        }
//
//    }
//
//}
