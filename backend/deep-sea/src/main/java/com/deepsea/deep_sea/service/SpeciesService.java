package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.SpeciesRequestDTO;
import com.deepsea.deep_sea.dto.SpeciesResponseDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.model.Species;
import com.deepsea.deep_sea.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import com.deepsea.deep_sea.mapper.SpeciesMapper;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class SpeciesService {

    private final SpeciesRepository speciesRepository;
    private final SpeciesMapper speciesMapper;

    public SpeciesService(SpeciesRepository speciesRepository,SpeciesMapper speciesMapper) {
        this.speciesRepository = speciesRepository;
        this.speciesMapper = speciesMapper;
    }

    @Transactional(readOnly = true)
    public List<SpeciesResponseDTO> getAllSpecies() {
        return speciesRepository.findAll().stream()
                .map(speciesMapper::toResponseDTO)
                .toList();
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

        Species species = Species.builder()
                .scientificName(stylizedScientificName)
                .commonName(dto.getCommonName().trim())
                .category(dto.getCategory().trim())
                .description(dto.getDescription())
                .build();

        Species savedSpecies = speciesRepository.save(species);
        return speciesMapper.toResponseDTO(savedSpecies);
    }
}