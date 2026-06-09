package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.service.MissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/missions")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')") 
    public ResponseEntity<?> createMission(@Valid @RequestBody MissionRequestDTO missionDto) {
            MissionResponseDTO response = missionService.createMission(missionDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MissionResponseDTO>> getAllMissions() {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMissionById(@PathVariable UUID id) {
            return ResponseEntity.ok(missionService.getMissionById(id));
        } 
}