package com.danang_auction.model.entity;

import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.model.enums.PaymentChannel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime timestamp;

    @Column(name = "transaction_code", unique = true, length = 50)
    private String transactionCode;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "note")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_channel")
    private PaymentChannel paymentChannel = PaymentChannel.BANK;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private AuctionSession session;
}
