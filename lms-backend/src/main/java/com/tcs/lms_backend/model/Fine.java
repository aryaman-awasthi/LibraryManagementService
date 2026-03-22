package com.tcs.lms_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Fine {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID fineId;

    // FOREIGN KEY: Link to the specific transaction
    // This matches: CONSTRAINT fk_issue FOREIGN KEY(issue_id) REFERENCES issue_transactions(id)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false, unique = true)
    private IssueTransaction transaction;

    // Matches DOUBLE PRECISION in SQL
    @Column(precision = 10, scale = 2)
    private Double amount;

    @CreationTimestamp
    @Column(name = "calculated_at", updatable = false)
    private LocalDateTime calculatedAt;

    // Default to false as per your SQL
    @Column(nullable = false)
    private Boolean paid = false;
}
