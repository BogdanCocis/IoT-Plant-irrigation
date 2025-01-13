package com.RC.Backend.controller;

import com.RC.Backend.dto.PumpDTO;
import com.RC.Backend.service.PumpService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pumps")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor

public class PumpController {
    private final PumpService pumpService;

    @GetMapping
    public ResponseEntity<List<PumpDTO>> getAllPumps() {
        return ResponseEntity.ok(pumpService.getAllPumps());
    }

    @PostMapping
    public ResponseEntity<PumpDTO> savePump(@RequestBody PumpDTO pumpDTO) {
        return ResponseEntity.ok(pumpService.savePump(pumpDTO));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updatePumpStatus(@PathVariable Long id, @RequestParam boolean status) {
        PumpDTO updatedPump = pumpService.updatePumpStatus(id, status);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Pump status updated successfully");
        response.put("pump", updatedPump);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/threshold")
    public ResponseEntity<PumpDTO> updateMoistureThreshold(@PathVariable Long id, @RequestParam float threshold) {
        return ResponseEntity.ok(pumpService.updateMoistureThreshold(id, threshold));
    }

    @PutMapping("/{id}/manualMode")
    public ResponseEntity<PumpDTO> updateManualMode(@PathVariable Long id, @RequestParam boolean manualMode) {
        return ResponseEntity.ok(pumpService.updateManualMode(id, manualMode));
    }
}