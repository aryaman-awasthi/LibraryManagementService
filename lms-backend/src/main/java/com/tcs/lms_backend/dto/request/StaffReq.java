package com.tcs.lms_backend.dto.request;


import com.tcs.lms_backend.enums.Role;
import lombok.Data;

@Data
public class StaffReq {


    private String name;

    private Role role;

    private String password;
}