package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.ObservationRequestDTO;
import com.deepsea.deep_sea.model.Observation;
import com.deepsea.deep_sea.service.ObservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/observations")
@CrossOrigin(origins = "*")
public class ObservationController {

    private final ObservationService observationService;

    public ObservationController(ObservationService observationService) {
        this.observationService = observationService;
    }

    // Only authenticated scientific staff can commit telemetry entries
    @PostMapping
    public ResponseEntity<?> logObservation(
            @RequestAttribute("userRole") String userRole, 
            @Valid @RequestBody ObservationRequestDTO dto) {

        if ("PUBLIC".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Public viewers are restricted to read-only access.");
        }

        try {
            Observation savedLog = observationService.saveObservation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLog);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Anyone can access findings metrics
    @GetMapping
    public ResponseEntity<List<Observation>> getAllObservations() {
        return ResponseEntity.ok(observationService.getAllObservations());
    }
}