package com.RC.Backend.controller;

import com.RC.Backend.dto.SensorDataDTO;
import com.RC.Backend.service.SensorDataService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensorData")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class SensorDataController {
    private final SensorDataService sensorDataService;

    @GetMapping
    public ResponseEntity<List<SensorDataDTO>> getAllSensorData() {
        return ResponseEntity.ok(sensorDataService.getAllSensorData());
    }

    @PostMapping
    public ResponseEntity<SensorDataDTO> saveSensorData(@RequestBody SensorDataDTO sensorDataDTO) {
        return ResponseEntity.ok(sensorDataService.saveSensorData(sensorDataDTO));
    }
}
