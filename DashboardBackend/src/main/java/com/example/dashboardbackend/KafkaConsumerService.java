package com.example.dashboardbackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
    @Autowired
    private DashboardRepository repository;

    @KafkaListener(topics = "transactions", groupId = "dashboard-group")
    public void consume(Transaction t){
        repository.save(t);
        System.out.println("Kafka Consumer saved transaction: " + t.getMerchant() + "-" + t.getAmount());
    }

}
