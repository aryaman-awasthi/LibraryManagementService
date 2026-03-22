package com.tcs.lms_backend.dto.request;

import lombok.Data;

@Data
public class IssueRequest {
    private Integer memberID;
    private Integer bookCopyID;
}
