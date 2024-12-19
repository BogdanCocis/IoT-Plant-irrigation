package com.RC.Backend.service;

import com.RC.Backend.entity.Session;
import com.RC.Backend.entity.User;
import com.RC.Backend.repository.SessionIdRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SessionIdService {
    private SessionIdRepository sessionIdRepository;

    public void save(Session session) {
        sessionIdRepository.save(session);
    }

    public Optional<Session> findByUserId(User user) {
        return sessionIdRepository.findByUser(user);
    }

    public void delete(Session session) {
        sessionIdRepository.delete(session);
    }

    public Optional<Session> findBySessionId(UUID sessionId) {
        return sessionIdRepository.findById(sessionId);
    }
}
