package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class ResearchAreaService {

    private final ResearchAreaRepository areaRepository;

    public ResearchAreaService(ResearchAreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    @Transactional
    public List<ResearchArea> getAllAreas() {
        return areaRepository.findAll();
    }

    @Transactional
    public ResearchArea getAreaById(UUID id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Research Area not found with ID: " + id));
    }

    @Transactional
    public ResearchArea createArea(ResearchArea area) {
        // Prevent duplicate area names
        if (areaRepository.findByAreaNameIgnoreCase(area.getAreaName().trim()).isPresent()) {
            throw new IllegalArgumentException("A research area named '" + area.getAreaName() + "' already exists.");
        }

        // Coordinate boundaries
        if (area.getLatitude() < -90.0 || area.getLatitude() > 90.0) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90 degrees.");
        }
        if (area.getLongitude() < -180.0 || area.getLongitude() > 180.0) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180 degrees.");
        }

        // Sanitize string text inputs before persistence
        area.setAreaName(area.getAreaName().trim());
        area.setRegion(area.getRegion().trim());

        return areaRepository.save(area);
    }
}
