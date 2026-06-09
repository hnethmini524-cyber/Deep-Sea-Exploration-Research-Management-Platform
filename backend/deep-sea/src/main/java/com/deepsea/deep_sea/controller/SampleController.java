package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.SampleRequestDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.service.SampleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/samples")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class SampleController {

    private final SampleService sampleService;

    public SampleController(SampleService sampleService) {
        this.sampleService = sampleService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')")
    public ResponseEntity<?> createSample(@Valid @RequestBody SampleRequestDTO sampleDto) {
            SampleResponseDTO response = sampleService.createSample(sampleDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SampleResponseDTO>> getAllSamples() {
        return ResponseEntity.ok(sampleService.getAllSamples());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSampleById(@PathVariable UUID id) {
            return ResponseEntity.ok(sampleService.getSampleById(id));
    }
}
