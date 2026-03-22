package com.tcs.lms_backend.controller;

import com.tcs.lms_backend.dto.response.ApiResponse;
import com.tcs.lms_backend.model.Book;
import com.tcs.lms_backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping("add")
    public ResponseEntity<ApiResponse<Book>> createBook(@RequestBody Book book) {
        Book savedBook = bookService.addBook(book);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("added book", savedBook));

    }

    @GetMapping("getBooks")
    public ResponseEntity<ApiResponse<List<Book>>> getAllBooks() {
        List<Book> books = bookService.getBooks();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("fetched all books successfully", books));
    }

    @GetMapping("getBook/{bookID}")
    public ResponseEntity<ApiResponse<Book>> getBook(@PathVariable int bookID) {
        Book book = bookService.getBook(bookID);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("fetched book successfully", book));

    }
}
