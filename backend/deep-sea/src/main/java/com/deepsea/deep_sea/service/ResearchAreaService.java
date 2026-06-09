package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.ResearchAreaRequestDTO;
import com.deepsea.deep_sea.dto.ResearchAreaResponseDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.mapper.ResearchAreaMapper;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class ResearchAreaService {

    private final ResearchAreaRepository areaRepository;
    private final ResearchAreaMapper areaMapper;

    public ResearchAreaService(ResearchAreaRepository areaRepository,ResearchAreaMapper areaMapper) {
        this.areaRepository = areaRepository;
        this.areaMapper = areaMapper;
    }

    @Transactional(readOnly = true)
    public List<ResearchAreaResponseDTO> getAllAreas() {
        return areaRepository.findAll().stream()
                .map(areaMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResearchAreaResponseDTO getAreaById(UUID id) {
        return areaRepository.findById(id)
                .map(areaMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Research Area not found with ID: " + id));
    }

    @Transactional
    public ResearchAreaResponseDTO createArea(ResearchAreaRequestDTO dto) {
        String sanitizedName = dto.getAreaName().trim();
        
        if (areaRepository.findByAreaNameIgnoreCase(sanitizedName).isPresent()) {
            throw new BadRequestException("A research area named '" + sanitizedName + "' already exists.");
        }

        validateCoordinates(dto.getLatitude(), dto.getLongitude());

        ResearchArea area = ResearchArea.builder()
                .areaName(sanitizedName)
                .region(dto.getRegion().trim())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .description(dto.getDescription())
                .build();

        ResearchArea savedArea = areaRepository.save(area);
        return areaMapper.toResponseDTO(savedArea);
    }

    private void validateCoordinates(double latitude, double longitude) {
        if (latitude < -90.0 || latitude > 90.0) {
            throw new BadRequestException("Latitude must be between -90 and 90 degrees.");
        }
        if (longitude < -180.0 || longitude > 180.0) {
            throw new BadRequestException("Longitude must be between -180 and 180 degrees.");
        }
    }
}