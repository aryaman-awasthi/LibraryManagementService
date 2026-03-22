package com.tcs.lms_backend.service;

import com.tcs.lms_backend.model.Book;
import com.tcs.lms_backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookService {

    @Autowired
    BookRepository bookRepository;
    public Book addBook(Book book) {
        Optional<Book> existingBook = bookRepository.findByIsbn(book.getIsbn());
        if (existingBook.isPresent()) {
            throw new RuntimeException("Book with ISBN " + book.getIsbn() + " already  exists.");
        }
        return bookRepository.save(book);
    }

    public List<Book> getBooks() {
        return bookRepository.findAll();
    }
}
