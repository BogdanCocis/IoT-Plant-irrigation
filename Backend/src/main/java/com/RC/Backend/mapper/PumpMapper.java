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
                .lastActivated(pumpDTO.getLastActivated())
                .build();
    }

    public PumpDTO toPumpDTO(Pump pump) {
        return new PumpDTO(
                pump.getId(),
                pump.isStatus(),
                pump.getLastActivated()
        );
    }
}