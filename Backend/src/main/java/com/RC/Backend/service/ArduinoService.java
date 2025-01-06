package com.RC.Backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ArduinoService {
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPumpStatusToArduino(boolean status) {
        // URL-ul for test
        String testUrl = "http://localhost:8080/api/test/updatePumpStatus?status=" + status;
        restTemplate.getForObject(testUrl, String.class);

        // Real URL-ul for Arduino
        // String realUrl = "http://arduino.local/updatePumpStatus?status=" + status;
        // restTemplate.getForObject(realUrl, String.class);
    }
}
