package com.danang_auction.model.entity;

import com.danang_auction.model.enums.AuctionStatus;
import com.danang_auction.model.enums.AuctionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "auction_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_code", unique = true)
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

    @Column(name = "deposit_amount", precision = 15, scale = 2)
    private BigDecimal depositAmount;

    @Column(name = "is_deposit_required")
    private Boolean isDepositRequired = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AuctionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "auction_type")
    private AuctionType auctionType;

    @Column(name = "starting_price", precision = 15, scale = 2)
    private BigDecimal startingPrice;

    @Column(name = "step_price", precision = 15, scale = 2)
    private BigDecimal stepPrice;

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

    // Quan hệ với documents
    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents;
}