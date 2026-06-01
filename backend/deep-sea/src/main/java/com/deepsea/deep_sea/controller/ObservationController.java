package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.ObservationRequestDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/observations")
public class ObservationController {

    @PostMapping
    public ResponseEntity<?> logObservation(
            @RequestHeader("X-User-Role") String userRole, 
            @Valid @RequestBody ObservationRequestDTO dto) {

        // Block public users from writing data
        if ("PUBLIC".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Public users are restricted to read-only views.");
        }

        return ResponseEntity.ok("Observation securely logged by internal staff member.");
    }

    // Anyone can view observations
    @GetMapping
    public ResponseEntity<?> getAllObservations() {
        // return ResponseEntity.ok(observationService.findAll());
        return ResponseEntity.ok("Fetched all observation data for open public viewing.");
    }
}
