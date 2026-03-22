package com.tcs.lms_backend.repository;

import com.tcs.lms_backend.enums.BookStatus;
import com.tcs.lms_backend.model.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookCopyRepository extends JpaRepository<BookCopy, Integer> {
//    // Find all copies of a specific book
//    List<BookCopy> findByBookId(Integer bookId);
//
//    // Find all available copies
//    List<BookCopy> findByStatus(BookStatus status);
}
