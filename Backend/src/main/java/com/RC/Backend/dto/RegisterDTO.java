package com.RC.Backend.dto;

import com.RC.Backend.entity.UserRole;
import lombok.Data;

@Data
public class RegisterDTO {
    private String name;
    private String email;
    private String password;
    private UserRole userRole;
}
