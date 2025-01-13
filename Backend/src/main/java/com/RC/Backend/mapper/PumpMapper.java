package com.RC.Backend.mapper;

import com.RC.Backend.dto.PumpDTO;
import com.RC.Backend.entity.Pump;
import org.springframework.stereotype.Component;

@Component
public class PumpMapper {

    public Pump toPump(PumpDTO pumpDTO) {
        return Pump.builder()
                .id(pumpDTO.getId())
                .status(pumpDTO.isStatus())
                .manualMode(pumpDTO.isManualMode())
                .lastActivated(pumpDTO.getLastActivated())
                .moistureThreshold(pumpDTO.getMoistureThreshold())
                .build();
    }

    public PumpDTO toPumpDTO(Pump pump) {
        return new PumpDTO(
                pump.getId(),
                pump.isStatus(),
                pump.isManualMode(),
                pump.getLastActivated(),
                pump.getMoistureThreshold()
        );
    }
}