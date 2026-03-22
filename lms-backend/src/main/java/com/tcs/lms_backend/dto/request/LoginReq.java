package com.tcs.lms_backend.dto.request;

import lombok.Data;

@Data
public class LoginReq {
    private int staff_id;
    private String password;
}
