package com.RC.Backend.controller;

import com.RC.Backend.dto.SensorDataDTO;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class WebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendSensorData(SensorDataDTO sensorDataDTO) {
        messagingTemplate.convertAndSend("/topic/sensorData", sensorDataDTO);
    }
}
