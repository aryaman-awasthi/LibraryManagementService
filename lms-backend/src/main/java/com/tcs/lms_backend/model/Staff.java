package com.tcs.lms_backend.model;


import com.tcs.lms_backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer staff_id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean isActive;

    private String password;
}
