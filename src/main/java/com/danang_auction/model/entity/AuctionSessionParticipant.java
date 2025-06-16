package com.danang_auction.model.entity;

import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_session_participants")
@Data
@NoArgsConstructor
@IdClass(AuctionSessionParticipantId.class)
public class AuctionSessionParticipant {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "auction_session_id", nullable = false)
    private AuctionSession auctionSession;

    private String role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantStatus status = ParticipantStatus.NEW;

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

    public AuctionSessionParticipant(User user, AuctionSession auctionSession, String role, ParticipantStatus status, DepositStatus depositStatus, LocalDateTime registeredAt, LocalDateTime createdAt) {
        this.user = user;
        this.auctionSession = auctionSession;
        this.role = role;
        this.status = status;
        this.depositStatus = depositStatus;
        this.registeredAt = registeredAt;
        this.createdAt = createdAt;
    }
}
