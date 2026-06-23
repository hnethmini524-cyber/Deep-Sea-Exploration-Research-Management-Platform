package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.SampleRequestDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.model.Sample;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import com.deepsea.deep_sea.model.enums.SampleType;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.mapper.SampleMapper;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.SampleRepository;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class SampleService {

    private final SampleRepository sampleRepository;
    private final SampleMapper sampleMapper;

    public SampleService(SampleRepository sampleRepository, SampleMapper sampleMapper) {
        this.sampleRepository = sampleRepository;
        this.sampleMapper = sampleMapper;
    }

    @Transactional(readOnly = true)
    public Page<SampleResponseDTO> getPaginatedSamples(Pageable pageable) {
        return sampleRepository.findAll(pageable).map(sampleMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public SampleResponseDTO getSampleById(UUID id) {
        return sampleRepository.findById(id)
                .map(sampleMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Target physical sample asset not found with ID: " + id));
    }

    @Transactional
    public SampleResponseDTO createSample(SampleRequestDTO dto) {
        // Parse out sample type enum parameter safely
        SampleType parsedType;
        try {
            parsedType = SampleType.valueOf(dto.getType().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Unsupported taxonomic physical sample type: " + dto.getType());
        }

        // Map directly into a standalone entity without lookups or relation handling
        Sample sampleEntity = sampleMapper.toEntity(dto, parsedType);
        
        Sample savedSample = sampleRepository.save(sampleEntity);
        
        return sampleMapper.toResponseDTO(savedSample);
    }
}