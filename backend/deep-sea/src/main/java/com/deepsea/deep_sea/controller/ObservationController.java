package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.ObservationRequestDTO;
import com.deepsea.deep_sea.dto.ObservationResponseDTO;
import com.deepsea.deep_sea.service.ObservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/observations")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class ObservationController {

    private final ObservationService observationService;

    public ObservationController(ObservationService observationService) {
        this.observationService = observationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')") 
    public ResponseEntity<?> logObservation(@Valid @RequestBody ObservationRequestDTO dto) {
        try {
            ObservationResponseDTO response = observationService.saveObservation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ObservationResponseDTO>> getAllObservations() {
        return ResponseEntity.ok(observationService.getAllObservations());
    }
}