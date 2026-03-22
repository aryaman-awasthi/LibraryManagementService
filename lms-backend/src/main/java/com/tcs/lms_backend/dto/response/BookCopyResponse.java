package com.tcs.lms_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookCopyResponse {
    private int bookCopyId;
    private int bookId;
    private String bookName;
    private String status;
    private boolean issued;
    private Integer memberId;
    private String memberName;
    private LocalDateTime issuedAt;
}
