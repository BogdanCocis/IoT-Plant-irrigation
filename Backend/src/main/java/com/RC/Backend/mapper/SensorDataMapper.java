package com.RC.Backend.mapper;

import com.RC.Backend.dto.SensorDataDTO;
import com.RC.Backend.entity.SensorData;
import org.springframework.stereotype.Component;

@Component
public class SensorDataMapper {

    public SensorData toSensorData(SensorDataDTO sensorDataDTO) {
        return SensorData.builder()
                .id(sensorDataDTO.getId())
                .temperature(sensorDataDTO.getTemperature())
                .humidity(sensorDataDTO.getHumidity())
                .soilMoisture(sensorDataDTO.getSoilMoisture())
                .timestamp(sensorDataDTO.getTimestamp())
                .build();
    }

    public SensorDataDTO toSensorDataDTO(SensorData sensorData) {
        return new SensorDataDTO(
                sensorData.getId(),
                sensorData.getTemperature(),
                sensorData.getHumidity(),
                sensorData.getSoilMoisture(),
                sensorData.getTimestamp()
        );
    }
}
