package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/areas")
@CrossOrigin(origins = "*")
public class ResearchAreaController {

    private final ResearchAreaRepository areaRepository;
    
    public ResearchAreaController(ResearchAreaRepository areaRepository) {
    	this.areaRepository = areaRepository;
    }

    // Only researchers/admins can establish new collection fields
    @PostMapping
    public ResponseEntity<?> createArea(
            @RequestAttribute("userRole") String userRole,
            @Valid @RequestBody ResearchArea area) {
        
        if ("PUBLIC".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Public accounts cannot register geographical areas.");
        }
        
        return ResponseEntity.ok(areaRepository.save(area));
    }

    // Anyone can view exploration sectors
    @GetMapping
    public ResponseEntity<List<ResearchArea>> getAllAreas() {
        return ResponseEntity.ok(areaRepository.findAll());
    }
}
