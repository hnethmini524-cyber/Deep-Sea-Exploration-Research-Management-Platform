package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.ResearchAreaRequestDTO;
import com.deepsea.deep_sea.dto.ResearchAreaResponseDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.mapper.ResearchAreaMapper;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class ResearchAreaService {

    private final ResearchAreaRepository areaRepository;
    private final ResearchAreaMapper areaMapper;

    public ResearchAreaService(ResearchAreaRepository areaRepository, ResearchAreaMapper areaMapper) {
        this.areaRepository = areaRepository;
        this.areaMapper = areaMapper;
    }

    @Transactional(readOnly = true)
    public Page<ResearchAreaResponseDTO> getPaginatedAreas(Pageable pageable) {
        
        return areaRepository
                .findAllPaginated(pageable)
                .map(areaMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public ResearchAreaResponseDTO getAreaById(UUID id) {
        ResearchArea area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research Area not found with ID: " + id));
        
        return areaMapper.toResponseDTO(area);
    }

    @Transactional
    public ResearchAreaResponseDTO createArea(ResearchAreaRequestDTO dto) {
        String sanitizedName = dto.getAreaName().trim();
        
        if (areaRepository.findByAreaNameIgnoreCase(sanitizedName).isPresent()) {
            throw new BadRequestException("A research area named '" + sanitizedName + "' already exists.");
        }

        ResearchArea areaEntity = areaMapper.toEntity(dto);
        ResearchArea savedArea = areaRepository.save(areaEntity);
        
        return areaMapper.toResponseDTO(savedArea);
    }
}