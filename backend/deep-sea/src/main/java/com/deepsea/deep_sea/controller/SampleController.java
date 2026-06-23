package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.SampleRequestDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.service.SampleService;
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
@RequestMapping("/api/v1/samples")
public class SampleController {

    private final SampleService sampleService;

    public SampleController(SampleService sampleService) {
        this.sampleService = sampleService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')")
    public ResponseEntity<SampleResponseDTO> createSample(@Valid @RequestBody SampleRequestDTO sampleDto) {
    	
        SampleResponseDTO response = sampleService.createSample(sampleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<SampleResponseDTO>> getAllSamples(
            @PageableDefault(page = 0, size = 15, sort = "collectionDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(sampleService.getPaginatedSamples(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SampleResponseDTO> getSampleById(@PathVariable UUID id) {
        return ResponseEntity.ok(sampleService.getSampleById(id));
    }
}
