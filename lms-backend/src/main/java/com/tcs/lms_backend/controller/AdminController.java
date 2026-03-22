package com.tcs.lms_backend.controller;

import com.tcs.lms_backend.dto.request.LoginReq;
import com.tcs.lms_backend.dto.request.StaffReq;
import com.tcs.lms_backend.dto.request.UpdateReq;
import com.tcs.lms_backend.dto.response.ApiResponse;
import com.tcs.lms_backend.dto.response.StaffResponse;
import com.tcs.lms_backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {
    @Autowired
    AdminService adminService;

    @PostMapping("create")
    public ResponseEntity<ApiResponse<StaffResponse>> createStaff (@RequestBody StaffReq staffReq) {

        StaffResponse staffResponse = adminService.createStaff(staffReq, true);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff Created", staffResponse));
    }

    @GetMapping("getStaff")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> getAllStaff() {
        List<StaffResponse> staff = adminService.getAllStaff();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Success", staff));
    }

    @GetMapping("getStaff/{staff_id}")
    public ResponseEntity<ApiResponse<StaffResponse>> getStaff(@PathVariable int staff_id) {
        StaffResponse staffResponse = adminService.getStaff(staff_id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Success", staffResponse));
    }

    @DeleteMapping("delete/{staff_id}")
    public ResponseEntity<ApiResponse<String>> deleteStaff(@PathVariable int staff_id) {
        String res = adminService.deleteStaff(staff_id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Success", res));
    }

    @PutMapping("update/{staff_id}")
    public ResponseEntity<ApiResponse<StaffResponse>> updateStaff(@PathVariable int staff_id, @RequestBody UpdateReq updateReq) {
        StaffResponse staffResponse = adminService.updateActivity(staff_id, updateReq);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Success", staffResponse));
    }

    @PostMapping("login")
    public ResponseEntity<ApiResponse<StaffResponse>> login (@RequestBody LoginReq loginReq) {
        StaffResponse staffResponse = adminService.login(loginReq);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("logged in", staffResponse));
    }
}
