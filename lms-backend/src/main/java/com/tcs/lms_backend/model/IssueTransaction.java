package com.tcs.lms_backend.model;

import com.tcs.lms_backend.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class IssueTransaction {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID issueID;

    // FOREIGN KEY 1: Link to the specific Book Copy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_copy_id", nullable = false)
    private BookCopy bookCopy;

    // FOREIGN KEY 2: Link to the Member who borrowed it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @CreationTimestamp
    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TransactionStatus status; // 'issued', 'returned'

    // Link to Fine (One-to-One relationship)
    // mappedBy refers to the field name in the Fine entity
    @OneToOne(mappedBy = "transaction", cascade = CascadeType.ALL)
    private Fine fine;
}
