package com.danang_auction.model.entity;

import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private PaymentType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "created_at")
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private AuctionSession session;
}