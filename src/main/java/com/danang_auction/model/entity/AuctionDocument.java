package com.danang_auction.model.entity;

import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "auction_documents")
@Data
@NoArgsConstructor
public class AuctionDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "document_code", unique = true, nullable = false)
    private String documentCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private AuctionSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "is_deposit_required")
    private Boolean isDepositRequired = true;

    @Enumerated(EnumType.STRING)
    private AuctionDocumentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "auction_type")
    private AuctionType auctionType;

    @Column(name = "starting_price")
    private Double startingPrice;

    @Column(name = "step_price")
    private Double stepPrice;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}