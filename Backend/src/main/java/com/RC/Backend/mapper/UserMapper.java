package com.RC.Backend.mapper;

import com.RC.Backend.dto.RegisterDTO;
import com.RC.Backend.dto.UserDTO;
import com.RC.Backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static User toUser(RegisterDTO registerDTO) {
        return User.builder()
                .name(registerDTO.getName())
                .email(registerDTO.getEmail())
                .password(registerDTO.getPassword())
                .userRole(registerDTO.getUserRole())
                .build();
    }

    public UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .idUser(user.getIdUser())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
