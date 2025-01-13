package com.RC.Backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ArduinoService {
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPumpStatusToArduino(boolean status) {
        String url = "http://192.168.0.105/updatePumpStatus?status=" + status;
        try {
            restTemplate.getForObject(url, String.class);
            System.out.println("Command sent to ESP32 successfully.");
        } catch (Exception e) {
            System.err.println("Error sending command to ESP32: " + e.getMessage());
        }
    }
}
