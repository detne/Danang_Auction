package com.danang_auction.model.entity;

import com.danang_auction.model.enums.AuctionSessionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "auction_sessions")
@Data
@NoArgsConstructor
public class AuctionSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_code", unique = true)
    private String sessionCode;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private AuctionSessionStatus status = AuctionSessionStatus.DRAFT;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public AuctionSession(Long id, String sessionCode, String title, String description,
                          AuctionSessionStatus status, LocalDateTime startTime,
                          LocalDateTime createdAt, LocalDateTime updatedAt, User createdBy) {
        this.id = id;
        this.sessionCode = sessionCode;
        this.title = title;
        this.description = description;
        this.status = status;
        this.startTime = startTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }
}
