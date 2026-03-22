package com.tcs.lms_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor

public class MemberWrapper {
    private Integer memberID;
    private String name;
    private LocalDateTime createdAt;
}
