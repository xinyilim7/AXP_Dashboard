package com.example.dashboardbackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/trends")
    public List<Map<String, Object>> getTrend(@RequestParam(defaultValue = "Daily") String dateRange) {
        return dashboardService.getTrendData(dateRange);
    }

    @GetMapping("/tickets")
    public List<Transaction> getTicket(@RequestParam(defaultValue = "Daily") String dateRange, @RequestParam(defaultValue = "amount") String sortBy) {
        return dashboardService.getTopTickets(dateRange, sortBy);
    }

    @GetMapping("/merchants")
    public List<Map<String, Object>> getMerchants(@RequestParam(defaultValue = "Daily") String dateRange, @RequestParam(defaultValue="amount") String sortBy) {
        return dashboardService.getTopMerchants(dateRange, sortBy);
    }

    @GetMapping("/payments")
    public List<Map<String, Object>> getPayments(@RequestParam(defaultValue = "Daily") String dateRange, @RequestParam(defaultValue = "volume") String sortBy) {
        return dashboardService.getTopPaymentMethods(dateRange, sortBy);
    }

}