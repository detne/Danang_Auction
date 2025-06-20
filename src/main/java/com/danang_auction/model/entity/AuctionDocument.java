package com.danang_auction.model.entity;

import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "auction_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "document_code", unique = true)
    private String documentCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private AuctionSession session;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "is_deposit_required")
    private Boolean isDepositRequired = true;

    @Enumerated(EnumType.STRING)
    private AuctionDocumentStatus status = AuctionDocumentStatus.PENDING_CREATE;

    @Enumerated(EnumType.STRING)
    @Column(name = "auction_type")
    private AuctionType auctionType = AuctionType.PUBLIC;

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
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}