package com.RC.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SensorDataDTO {
    private Long id;
    private float temperature;
    private float humidity;
    private float soilMoisture;
    private LocalDateTime timestamp;
}
