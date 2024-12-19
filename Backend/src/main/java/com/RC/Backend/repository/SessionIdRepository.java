package com.RC.Backend.repository;

import com.RC.Backend.entity.Session;
import com.RC.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionIdRepository extends JpaRepository<Session, UUID> {
    Optional<Session> findByUser(User user);
}
