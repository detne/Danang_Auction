package com.danang_auction.model.entity;

import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_session_participants")
@Data
@NoArgsConstructor
@IdClass(AuctionSessionParticipantId.class)
public class AuctionSessionParticipant {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id", nullable = false)
    private AuctionSession auctionSession;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantStatus status = ParticipantStatus.WAITING_START;

    @Enumerated(EnumType.STRING)
    @Column(name = "deposit_status", nullable = false)
    private DepositStatus depositStatus = DepositStatus.PENDING;

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deposit_amount", nullable = false)
    private Double depositAmount = 0.0;

    // Giá thắng cuối cùng cho người thắng
    @Column(name = "final_price")
    private Double finalPrice;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public AuctionSessionParticipant(User user, AuctionSession auctionSession, UserRole role,
            ParticipantStatus status, DepositStatus depositStatus) {
        this.user = user;
        this.auctionSession = auctionSession;
        this.role = role;
        this.status = status;
        this.depositStatus = depositStatus;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAuctionSession(AuctionSession session) {
        this.auctionSession = session;
    }
}
