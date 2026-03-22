package com.tcs.lms_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID memberID;

    @Column(nullable = false)
    private String name;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Optional: Reference to all books currently issued to this member
    @OneToMany(mappedBy = "issuedTo")
    private List<BookCopy> borrowedCopies;

    // Optional: History of all transactions for this member
    @OneToMany(mappedBy = "member")
    private List<IssueTransaction> transactions;

}
