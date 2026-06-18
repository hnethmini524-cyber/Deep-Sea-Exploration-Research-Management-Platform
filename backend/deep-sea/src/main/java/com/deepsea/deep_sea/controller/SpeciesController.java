package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.SpeciesRequestDTO;
import com.deepsea.deep_sea.dto.SpeciesResponseDTO;
import com.deepsea.deep_sea.service.SpeciesService;
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
@RequestMapping("/api/v1/species")
public class SpeciesController {

    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')") 
    public ResponseEntity<SpeciesResponseDTO> addSpecies(@Valid @RequestBody SpeciesRequestDTO speciesDto) {
        SpeciesResponseDTO response = speciesService.addSpecies(speciesDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<SpeciesResponseDTO>> getAllSpecies(
            @PageableDefault(page = 0, size = 10, sort = "scientificName", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(speciesService.getPaginatedSpecies(pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SpeciesResponseDTO> getSpeciesById(@PathVariable UUID id) {
        return ResponseEntity.ok(speciesService.getSpeciesById(id));
    }
}