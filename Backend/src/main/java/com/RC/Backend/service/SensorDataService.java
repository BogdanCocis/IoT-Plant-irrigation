package com.RC.Backend.service;

import com.RC.Backend.controller.WebSocketController;
import com.RC.Backend.dto.SensorDataDTO;
import com.RC.Backend.entity.SensorData;
import com.RC.Backend.mapper.SensorDataMapper;
import com.RC.Backend.repository.SensorDataRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SensorDataService {
    private final SensorDataRepository sensorDataRepository;
    private final SensorDataMapper sensorDataMapper;
    private final ArduinoService arduinoService;
    private final WebSocketController webSocketController;

    public List<SensorDataDTO> getAllSensorData() {
        return sensorDataRepository.findAll().stream()
                .map(sensorDataMapper::toSensorDataDTO)
                .collect(Collectors.toList());
    }

    public SensorDataDTO saveSensorData(SensorDataDTO sensorDataDTO) {
        SensorData sensorData = sensorDataMapper.toSensorData(sensorDataDTO);
        sensorData = sensorDataRepository.save(sensorData);
        SensorDataDTO savedDTO = sensorDataMapper.toSensorDataDTO(sensorData);

        webSocketController.sendSensorData(savedDTO);

        return savedDTO;
    }

    private void checkSoilMoisture(SensorDataDTO sensorDataDTO) {
        if (sensorDataDTO.getSoilMoisture() < 30.0) {
            arduinoService.sendPumpStatusToArduino(true);
        } else {
            arduinoService.sendPumpStatusToArduino(false);
        }
    }

    @Scheduled(fixedRate = 5000)
    public void sendRealTimeSensorData() {
        List<SensorDataDTO> sensorDataList = sensorDataRepository.findAll().stream()
                .map(sensorDataMapper::toSensorDataDTO)
                .collect(Collectors.toList());

        sensorDataList.forEach(webSocketController::sendSensorData);
    }
}