package com.RC.Backend.controller;

import com.RC.Backend.dto.PumpDTO;
import com.RC.Backend.service.PumpService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<PumpDTO> updatePumpStatus(@PathVariable Long id, @RequestParam boolean status) {
        return ResponseEntity.ok(pumpService.updatePumpStatus(id, status));
    }
}