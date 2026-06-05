package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.service.MissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/missions")
@CrossOrigin(origins = "*")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping
    public ResponseEntity<?> createMission(
            @RequestAttribute("userRole") String userRole,
            @Valid @RequestBody Mission mission) {

        if ("PUBLIC".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Public accounts are limited to read-only access.");
        }

        try {
            return ResponseEntity.ok(missionService.createMission(mission));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Mission>> getAllMissions() {
        return ResponseEntity.ok(missionService.getAllMissions());
    }
}