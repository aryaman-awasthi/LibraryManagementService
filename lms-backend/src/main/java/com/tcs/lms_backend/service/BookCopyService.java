package com.tcs.lms_backend.service;

import com.tcs.lms_backend.enums.BookStatus;
import com.tcs.lms_backend.model.Book;
import com.tcs.lms_backend.model.BookCopy;
import com.tcs.lms_backend.repository.BookCopyRepository;
import com.tcs.lms_backend.repository.BookRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookCopyService {
    @Autowired
    BookCopyRepository bookCopyRepository;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    BookService bookService;

    @Transactional
    public BookCopy addCopy(int bookId, BookCopy bookCopy) {

        Book book = bookService.getBook(bookId);

        bookCopy.setBook(book);

        if (bookCopy.getStatus() == null) {
            bookCopy.setStatus(BookStatus.AVAILABLE);
        }

        return bookCopyRepository.save(bookCopy);
    }

    public List<BookCopy> getBookCopies(int bookId) {
        return bookCopyRepository.findByBookBookID(bookId);
    }
}
