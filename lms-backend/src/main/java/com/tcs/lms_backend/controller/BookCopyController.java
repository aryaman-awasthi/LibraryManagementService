package com.tcs.lms_backend.controller;

import com.tcs.lms_backend.dto.response.ApiResponse;
import com.tcs.lms_backend.model.BookCopy;
import com.tcs.lms_backend.service.BookCopyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/books")
public class BookCopyController {
    @Autowired
    BookCopyService bookCopyService;

    @PostMapping("create/book_copy/{id}")
    public ResponseEntity<ApiResponse<BookCopy>> createCopy(
            @PathVariable int id,
            @RequestBody BookCopy bookCopy
    ) {
        BookCopy bookCopyRes = bookCopyService.addCopy(id, bookCopy);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("book copy created", bookCopyRes));
    }
}
