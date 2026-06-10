package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.ResearchAreaRequestDTO;
import com.deepsea.deep_sea.dto.ResearchAreaResponseDTO;
import com.deepsea.deep_sea.service.ResearchAreaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/areas")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class ResearchAreaController {

    private final ResearchAreaService areaService;

    public ResearchAreaController(ResearchAreaService areaService) {
        this.areaService = areaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')") 
    public ResponseEntity<ResearchAreaResponseDTO> createArea(@Valid @RequestBody ResearchAreaRequestDTO areaDto) {
            ResearchAreaResponseDTO response = areaService.createArea(areaDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ResearchAreaResponseDTO>> getAllAreas() {
        return ResponseEntity.ok(areaService.getAllAreas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ResearchAreaResponseDTO> getAreaById(@PathVariable UUID id) {
            ResearchAreaResponseDTO response = areaService.getAreaById(id);
            return ResponseEntity.ok(response);
    }
}