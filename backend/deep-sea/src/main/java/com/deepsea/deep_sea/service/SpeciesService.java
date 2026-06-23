package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.SpeciesRequestDTO;
import com.deepsea.deep_sea.dto.SpeciesResponseDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.model.Species;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.SpeciesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.deepsea.deep_sea.mapper.SpeciesMapper;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class SpeciesService {

    private final SpeciesRepository speciesRepository;
    private final MissionRepository missionRepository;
    private final SpeciesMapper speciesMapper;

    public SpeciesService(SpeciesRepository speciesRepository, MissionRepository missionRepository, SpeciesMapper speciesMapper) {
        this.speciesRepository = speciesRepository;
        this.missionRepository = missionRepository;
        this.speciesMapper = speciesMapper;
    }

    @Transactional(readOnly = true)
    public Page<SpeciesResponseDTO> getPaginatedSpecies(Pageable pageable) {
        return speciesRepository.findAll(pageable).map(speciesMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public SpeciesResponseDTO getSpeciesById(UUID id) {
        return speciesRepository.findById(id)
                .map(speciesMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Species profile not found with ID: " + id));
    }

    @Transactional
    public SpeciesResponseDTO addSpecies(SpeciesRequestDTO dto) {
        String stylizedScientificName = dto.getScientificName().trim();

        if (speciesRepository.findByScientificNameIgnoreCase(stylizedScientificName).isPresent()) {
            throw new BadRequestException("Species classification '" + stylizedScientificName + "' is already registered.");
        }

        Species speciesEntity = speciesMapper.toEntity(dto);
        Species savedSpecies = speciesRepository.save(speciesEntity);

        return speciesMapper.toResponseDTO(savedSpecies);
    }
}