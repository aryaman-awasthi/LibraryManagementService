package com.tcs.lms_backend.repository;

import com.tcs.lms_backend.model.IssueTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueTransactionRepository extends JpaRepository<IssueTransaction, Integer> {
}
