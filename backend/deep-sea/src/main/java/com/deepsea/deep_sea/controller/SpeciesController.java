package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.model.Species;
import com.deepsea.deep_sea.service.SpeciesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/species")
@CrossOrigin(origins = "*")
public class SpeciesController {

    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @PostMapping
    public ResponseEntity<?> addSpecies(
            @RequestAttribute("userRole") String userRole,
            @Valid @RequestBody Species species) {

        if ("PUBLIC".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Public accounts cannot alter taxonomic lists.");
        }

        try {
            return ResponseEntity.ok(speciesService.addSpecies(species));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Species>> getAllSpecies() {
        return ResponseEntity.ok(speciesService.getAllSpecies());
    }
}