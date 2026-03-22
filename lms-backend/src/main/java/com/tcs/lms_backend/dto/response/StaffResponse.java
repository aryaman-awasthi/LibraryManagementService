package com.tcs.lms_backend.dto.response;


import com.tcs.lms_backend.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffResponse {

    @Id
    private Integer staff_id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean isActive;
}
