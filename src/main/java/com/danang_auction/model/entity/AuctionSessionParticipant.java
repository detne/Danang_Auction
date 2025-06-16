package com.danang_auction.model.entity;

import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.io.Serializable;

@Entity
@Table(name = "auction_session_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(AuctionSessionParticipantId.class)
public class AuctionSessionParticipant implements Serializable {

    @Id
    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId; // Thêm trường này để khớp với userId trong IdClass

    @Id
    @Column(name = "auction_session_id", insertable = false, updatable = false)
    private Long auctionSessionId; // Thêm trường này để khớp với auctionSessionId trong IdClass

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Giữ mối quan hệ để truy xuất đối tượng User

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id", nullable = false)
    private AuctionSession auctionSession; // Giữ mối quan hệ để truy xuất đối tượng AuctionSession

    @Column(name = "role")
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ParticipantStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "deposit_status")
    private DepositStatus depositStatus;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}