package com.RC.Backend.service;

import com.RC.Backend.dto.PumpDTO;
import com.RC.Backend.entity.Pump;
import com.RC.Backend.mapper.PumpMapper;
import com.RC.Backend.repository.PumpRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PumpService {
    private final PumpRepository pumpRepository;
    private final PumpMapper pumpMapper;
    private final ArduinoService arduinoService;

    public List<PumpDTO> getAllPumps() {
        return pumpRepository.findAll().stream()
                .map(pumpMapper::toPumpDTO)
                .collect(Collectors.toList());
    }

    public PumpDTO savePump(PumpDTO pumpDTO) {
        Pump pump = pumpMapper.toPump(pumpDTO);
        pump = pumpRepository.save(pump);
        return pumpMapper.toPumpDTO(pump);
    }

    public PumpDTO updatePumpStatus(Long id, boolean status) {
        Pump pump = pumpRepository.findById(id).orElseThrow(() -> new RuntimeException("Pump not found"));
        pump.setStatus(status);
        pump.setLastActivated(LocalDateTime.now());
        pump = pumpRepository.save(pump);
        arduinoService.sendPumpStatusToArduino(status);
        return pumpMapper.toPumpDTO(pump);
    }

    public PumpDTO updateMoistureThreshold(Long id, float threshold) {
        Pump pump = pumpRepository.findById(id).orElseThrow(() -> new RuntimeException("Pump not found"));
        pump.setMoistureThreshold(threshold);
        pump = pumpRepository.save(pump);
        return pumpMapper.toPumpDTO(pump);
    }
}