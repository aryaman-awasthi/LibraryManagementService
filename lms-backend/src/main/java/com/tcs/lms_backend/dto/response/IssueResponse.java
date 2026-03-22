package com.tcs.lms_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IssueResponse {

    private int issueId;
    private int bookCopyId;
    private int bookId;
    private String bookName;
    private int memberId;
    private String memberName;
    private LocalDateTime issuedAt;
    private String status;
}