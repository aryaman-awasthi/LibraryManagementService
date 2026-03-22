package com.tcs.lms_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tcs.lms_backend.enums.BookStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCopy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookCopyID;

    // FOREIGN KEY 1: Link to the Book (The Parent)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // Use an Enum for status to match your CHECK constraint
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private BookStatus status; // 'available', 'damaged', 'lost'

    private Boolean issued = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_to") // This is nullable in your SQL
    private Member issuedTo;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
