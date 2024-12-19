package com.RC.Backend.controller;

import com.RC.Backend.dto.LoginDTO;
import com.RC.Backend.dto.RegisterDTO;
import com.RC.Backend.entity.Session;
import com.RC.Backend.exception.DuplicateException;
import com.RC.Backend.exception.InvalidDataException;
import com.RC.Backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@AllArgsConstructor
@RestController
@Slf4j
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api")

public class AccountController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        try {
            userService.saveUser(registerDTO);
        } catch (InvalidDataException | DuplicateException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", exception.getMessage()));
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "Account created successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        try {
            Session session = userService.login(loginDTO.getEmail(), loginDTO.getPassword());

            Cookie sessionCookie = new Cookie("sessionID", session.getSessionId().toString());
            Long cookieAge = Duration.between(LocalDateTime.now(), session.getExpirationTime()).getSeconds();
            sessionCookie.setHttpOnly(true);
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(cookieAge.intValue());
            response.addCookie(sessionCookie);

            return ResponseEntity.ok(Collections.singletonMap("courier", Map.of(
                    "id", session.getUser().getIdUser(),
                    "role", session.getUser().getUserRole()
            )));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}