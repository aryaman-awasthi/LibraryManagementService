package com.tcs.lms_backend.repository;

import com.tcs.lms_backend.enums.TransactionStatus;
import com.tcs.lms_backend.model.BookCopy;
import com.tcs.lms_backend.model.IssueTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssueTransactionRepository extends JpaRepository<IssueTransaction, Integer> {
    Optional<IssueTransaction> findTopByBookCopyAndStatusOrderByIssuedAtDesc(
            BookCopy bookCopy,
            TransactionStatus status
    );
}
