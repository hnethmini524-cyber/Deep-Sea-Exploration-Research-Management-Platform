package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.ResearchAreaRequestDTO;
import com.deepsea.deep_sea.dto.ResearchAreaResponseDTO;
import com.deepsea.deep_sea.service.ResearchAreaService;
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
@RequestMapping("/api/v1/areas")
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
    public ResponseEntity<Page<ResearchAreaResponseDTO>> getAllAreas(
            @PageableDefault(page = 0, size = 12, sort = "areaName", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(areaService.getPaginatedAreas(pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ResearchAreaResponseDTO> getAreaById(@PathVariable UUID id) {
        return ResponseEntity.ok(areaService.getAreaById(id));
    }
}