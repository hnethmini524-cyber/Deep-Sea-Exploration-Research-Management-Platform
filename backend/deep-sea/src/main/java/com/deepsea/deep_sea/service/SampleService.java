package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.SampleRequestDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.mapper.SampleMapper;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.Sample;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.*;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.SampleRepository;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SampleService {

    private final SampleRepository sampleRepository;
    private final MissionRepository missionRepository;
    private final UserRepository userRepository;
    private final SampleMapper sampleMapper;

    public SampleService(SampleRepository sampleRepository, 
                         MissionRepository missionRepository, 
                         UserRepository userRepository,SampleMapper sampleMapper) {
        this.sampleRepository = sampleRepository;
        this.missionRepository = missionRepository;
        this.userRepository = userRepository;
        this.sampleMapper = sampleMapper;
    }

    @Transactional(readOnly = true)
    public List<SampleResponseDTO> getAllSamples() {
        return sampleRepository.findAllWithFullContext().stream()
                .map(sampleMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public SampleResponseDTO getSampleById(UUID id) {
        return sampleRepository.findById(id)
                .map(sampleMapper::toResponseDTO)
                .orElseThrow(() -> new IllegalArgumentException("Target physical sample asset not found with ID: " + id));
    }

    @Transactional
    public SampleResponseDTO createSample(SampleRequestDTO dto) {
        Mission mission = missionRepository.findById(dto.getMissionId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned mission execution scope does not exist."));

        User collector = userRepository.findById(dto.getCollectedById())
                .orElseThrow(() -> new IllegalArgumentException("Assigned biological field technician/researcher does not exist."));

        if (MissionStatus.ACTIVE != mission.getStatus()) {
            throw new IllegalStateException("Process Aborted: Cannot log samples for an inactive mission profile.");
        }

        if (UserRole.PUBLIC == collector.getRole()) {
            throw new IllegalArgumentException("Access Denied: Specified employee credentials lack operational logging rights.");
        }

        SampleType parsedType;
        try {
            parsedType = SampleType.valueOf(dto.getType().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unsupported taxonomic physical sample type: " + dto.getType());
        }

        Sample sample = Sample.builder()
                .type(parsedType)
                .collectionDate(dto.getCollectionDate())
                .notes(dto.getNotes() != null ? dto.getNotes().trim() : null)
                .mission(mission)
                .collectedBy(collector)
                .build();

        Sample savedSample = sampleRepository.save(sample);
        return sampleMapper.toResponseDTO(savedSample);
    }
}
