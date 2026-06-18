package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.dto.MissionUpdateDTO;
import com.deepsea.deep_sea.service.MissionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/missions")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')") 
    public ResponseEntity<MissionResponseDTO> createMission(@Valid @RequestBody MissionRequestDTO missionDto) {
        MissionResponseDTO response = missionService.createMission(missionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<MissionResponseDTO>> getAllMissions(
            @PageableDefault(page = 0, size = 10, sort = "launchDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(missionService.getPaginatedMissions(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MissionResponseDTO> getMissionById(@PathVariable UUID id) {
            return ResponseEntity.ok(missionService.getMissionById(id));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')")
    public ResponseEntity<MissionResponseDTO> updateMission(
            @PathVariable UUID id, 
            @Valid @RequestBody MissionUpdateDTO updateDto) {
        
        MissionResponseDTO response = missionService.updateMission(id, updateDto);
        return ResponseEntity.ok(response);
    }
}