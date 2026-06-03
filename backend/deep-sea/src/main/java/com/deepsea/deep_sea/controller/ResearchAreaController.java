package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.service.ResearchAreaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/areas")
@CrossOrigin(origins = "*")
public class ResearchAreaController {

    private final ResearchAreaService areaService;

    public ResearchAreaController(ResearchAreaService areaService) {
        this.areaService = areaService;
    }

    @PostMapping
    public ResponseEntity<?> createArea(
            @RequestAttribute("userRole") String userRole,
            @Valid @RequestBody ResearchArea area) {
        
        if ("PUBLIC".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Public accounts cannot register geographical areas.");
        }
        
        try {
            return ResponseEntity.ok(areaService.createArea(area));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ResearchArea>> getAllAreas() {
        return ResponseEntity.ok(areaService.getAllAreas());
    }
}