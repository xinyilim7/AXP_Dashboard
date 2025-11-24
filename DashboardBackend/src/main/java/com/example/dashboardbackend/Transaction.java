package com.example.dashboardbackend;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="Transaction")
@Data // automatically create getter & setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto increment ID
    private Long id;
    private Double amount;
    private String status;
    private String merchant;
    private String category;
    private LocalDateTime timestamp;
}
