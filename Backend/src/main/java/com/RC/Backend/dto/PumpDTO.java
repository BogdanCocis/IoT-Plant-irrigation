package com.RC.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PumpDTO {
    private Long id;
    private boolean status;
    private LocalDateTime lastActivated;
    private float moistureThreshold;
}
