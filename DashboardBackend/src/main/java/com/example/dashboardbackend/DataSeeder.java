package com.example.dashboardbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Random;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner initDatabase (DashboardRepository repository){
    return args -> {
        if(repository.count()==0){
            System.out.println("Seeding database with fake data");

            String[] merchants = { "Gacha Nexus", "Infinite Play", "EverHydrate", "Kotaku", "MillionMinda","DT Earth Bistrocafe", "BajuPrint", "Phonenest", "Joy Jungle", "Hamper Emporium", "ABC", "XYZ"};
            String[] statuses ={"success", "success","success", "failed", "pending"};
            String[] categories ={"RHB", "CIMB", "AiraPay", "Alipay+", "Boost", "DuitnowQR", "GrabPay", "MCash", "MobyPay", "Paydee", "Retailpay", "ShopeePay", "SPay", "SPayLater", "TnG", "UnionPay", "WannaPay", "WavPay", "Visa", "Mastercard", "FPX"};

            Random random = new Random();

            // Generate 500 random transactions
            for(int i =0; i< 500;i++){
                Transaction t = new Transaction();

                // Random amount
                double amount = 10 + (1000 - 10) * random.nextDouble();
                t.setAmount(Math.round(amount *100.0)/100.0);

                // Random merchant
                t.setMerchant(merchants[random.nextInt(merchants.length)]);
                t.setStatus(statuses[random.nextInt(statuses.length)]);
                t.setCategory(categories[random.nextInt(categories.length)]);

                // Random timestamp
                int daysAgo = random.nextInt(30);
                int hoursAgo = random.nextInt(24);
                int minutesAgo = random.nextInt(60);
                LocalDateTime timestamp = LocalDateTime.now().minusDays(daysAgo).minusHours(hoursAgo).minusMinutes(minutesAgo);
                t.setTimestamp(timestamp);

                repository.save(t);
            }
            System.out.println("Database seeded with 500 transactions!");
        }
    };
    }
}
