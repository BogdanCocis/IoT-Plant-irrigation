package com.RC.Backend.repository;

import com.RC.Backend.entity.Pump;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PumpRepository extends JpaRepository<Pump, Long> {
}
