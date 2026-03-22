package com.tcs.lms_backend.service;

import com.tcs.lms_backend.dto.request.LoginReq;
import com.tcs.lms_backend.dto.request.StaffReq;
import com.tcs.lms_backend.dto.request.UpdateReq;
import com.tcs.lms_backend.dto.response.StaffResponse;
import com.tcs.lms_backend.enums.Role;
import com.tcs.lms_backend.exception.UnauthorizedException;
import com.tcs.lms_backend.model.Staff;
import com.tcs.lms_backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private static final int ADMIN_USER_ID = 10101010;
    private static final String ADMIN_PASSWORD = "qwerty@123";

    @Autowired
    AdminRepository adminRepository;

    public StaffResponse createStaff(StaffReq staffReq, boolean isActive) {
        if (staffReq.getName() == null || staffReq.getName().isEmpty()) {
            throw new RuntimeException("Name cannot be empty");
        }
        if (staffReq.getRole() == null || staffReq.getRole().toString().isEmpty()) {
            throw new RuntimeException("Role cannot be empty");
        }
        if (staffReq.getPassword() == null || staffReq.getPassword().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        Staff staff = new Staff();
        staff.setName(staffReq.getName());
        staff.setRole(staffReq.getRole());
        staff.setActive(isActive);
        staff.setPassword(staffReq.getPassword());

        Staff savedStaff = adminRepository.save(staff);

        StaffResponse staffResponse = new StaffResponse();
        staffResponse.setStaff_id(savedStaff.getStaff_id());
        staffResponse.setName(savedStaff.getName());
        staffResponse.setRole(savedStaff.getRole());
        staffResponse.setActive(savedStaff.isActive());
        return staffResponse;
    }

    public List<StaffResponse> getAllStaff() {
        return adminRepository.getStaffMembers();
    }

    public String getPassword(int staffId) {
        return adminRepository.findById(staffId).get().getPassword();
    }

    public String deleteStaff(int staffId) {
        adminRepository.delete(adminRepository.findById(staffId).get());
        return "deleted";
    }

    public StaffResponse updateActivity(int staffId, UpdateReq updateReq) {
        Staff staff = adminRepository.findById(staffId).get();
        System.out.println(staff.toString());
        System.out.println(updateReq.toString());

        staff.setActive(updateReq.isActive());

        adminRepository.save(staff);

        StaffResponse staffResponse = new StaffResponse();
        staffResponse.setActive(staff.isActive());
        staffResponse.setRole(staff.getRole());
        staffResponse.setName(staff.getName());
        staffResponse.setStaff_id(staff.getStaff_id());

        return staffResponse;
    }

    public StaffResponse getStaff(int staffId) {
//        System.out.println(adminRepository.getStaffMember(staffId).toString());
        return adminRepository.getStaffMember(staffId);
    }

    public StaffResponse login(LoginReq loginReq) {
        int userId = loginReq.getStaff_id();
        String password = loginReq.getPassword();

        if (ADMIN_USER_ID == userId) {
            if (!ADMIN_PASSWORD.equals(password)) {
                throw new UnauthorizedException("Invalid credentials");
            }
            else {
                return new StaffResponse(userId, "admin", Role.ADMIN, true);
            }
        } else {
            String originalPassword;
            try {
                originalPassword = getPassword(userId);
            } catch (Exception e) {
                throw new UnauthorizedException("Invalid staff id");
            }
            if (originalPassword.equals(password)) {

                return getStaff(userId);

            } else {
                throw new UnauthorizedException("Invalid credentials");
            }

        }
    }
}
