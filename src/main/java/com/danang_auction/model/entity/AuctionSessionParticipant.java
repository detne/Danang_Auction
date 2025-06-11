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
@AllArgsConstructor
@IdClass(AuctionSessionParticipantId.class)
public class AuctionSessionParticipant implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    private String role;

    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    @Enumerated(EnumType.STRING)
    private DepositStatus depositStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
