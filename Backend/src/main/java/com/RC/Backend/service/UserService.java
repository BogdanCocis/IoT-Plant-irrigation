package com.RC.Backend.service;

import com.RC.Backend.dto.RegisterDTO;
import com.RC.Backend.entity.Session;
import com.RC.Backend.entity.User;
import com.RC.Backend.entity.UserRole;
import com.RC.Backend.exception.DuplicateException;
import com.RC.Backend.exception.InvalidDataException;
import com.RC.Backend.mapper.UserMapper;
import com.RC.Backend.repository.UserRepository;
import com.RC.Backend.validator.UserValidator;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor

public class UserService {
    private final UserRepository userRepository;
    private final SessionIdService sessionIdService;
    private final PasswordEncoder passwordEncoder;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserMapper userMapper;

    public Session login(String loginEmail, String loginPassword) throws Exception {

        Optional<User> user = userRepository.findByEmail(loginEmail);
        if (user.isPresent()) {
            Session session;
            String userPassword = user.get().getPassword();

            if (bCryptPasswordEncoder.matches(loginPassword, userPassword)) {

                Optional<Session> existingSessionId = sessionIdService.findByUserId(user.get());
                if (existingSessionId.isPresent()) {
                    if (existingSessionId.get().getExpirationTime().isAfter(LocalDateTime.now())) {
                        return existingSessionId.get();
                    } else {
                        sessionIdService.delete(existingSessionId.get());
                        LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(360);
                        session = new Session(UUID.randomUUID(), expirationDate, user.get());
                        sessionIdService.save(session);
                        return session;
                    }
                } else {
                    LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(360);
                    session = new Session(UUID.randomUUID(), expirationDate, user.get());
                    sessionIdService.save(session);
                    return session;
                }
            } else {
                throw new Exception("Invalid password!");
            }
        }
        throw new Exception("User not found!");
    }

    public void saveUser(RegisterDTO registerDTO) throws InvalidDataException, DuplicateException {
        UserValidator.validateRegister(registerDTO);

        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new DuplicateException("Email is already in use!");
        }

        User user = UserMapper.toUser(registerDTO);

        if (registerDTO.getUserRole() != null && (registerDTO.getUserRole() == UserRole.USER || registerDTO.getUserRole() == UserRole.CHILD)) {
            user.setUserRole(registerDTO.getUserRole());
        } else {
            user.setUserRole(UserRole.USER);
        }

        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        userRepository.save(user);
    }
}
