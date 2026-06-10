package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.SpeciesRequestDTO;
import com.deepsea.deep_sea.dto.SpeciesResponseDTO;
import com.deepsea.deep_sea.service.SpeciesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/species")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class SpeciesController {

    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')") // Enforces security transparently using the application's roles
    public ResponseEntity<SpeciesResponseDTO> addSpecies(@Valid @RequestBody SpeciesRequestDTO speciesDto) {
            SpeciesResponseDTO response = speciesService.addSpecies(speciesDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SpeciesResponseDTO>> getAllSpecies() {
        return ResponseEntity.ok(speciesService.getAllSpecies());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SpeciesResponseDTO> getSpeciesById(@PathVariable UUID id) {
        	SpeciesResponseDTO response = speciesService.getSpeciesById(id);
            return ResponseEntity.ok(response);
        }
}