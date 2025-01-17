package com.RC.Backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ArduinoService {
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPumpStatusToArduino(boolean status) {
        String url = "***BOARD_ADRESS***" + status;
        try {
            restTemplate.getForObject(url, String.class);
            System.out.println("Command sent to board successfully.");
        } catch (Exception e) {
            System.err.println("Error sending command to board " + e.getMessage());
        }
    }
}
