package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.dto.MissionUpdateDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.mapper.MissionMapper;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import com.deepsea.deep_sea.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final MissionMapper missionMapper;
    private final ResearchAreaRepository areaRepository;
    private final UserRepository userRepository;

    public MissionService(MissionRepository missionRepository, MissionMapper missionMapper,ResearchAreaRepository areaRepository,UserRepository userRepository) {
        this.missionRepository = missionRepository;
        this.missionMapper = missionMapper;
        this.areaRepository= areaRepository;
        this.userRepository= userRepository;
    }
    
    @Transactional
    public MissionResponseDTO createMission(MissionRequestDTO dto) {
    	
        User leader = userRepository.findById(dto.getLeadResearcherId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned researcher profile does not exist."));

        ResearchArea area = areaRepository.findById(dto.getResearchAreaId())
                .orElseThrow(() -> new ResourceNotFoundException("Target geographical research area does not exist."));

        if (dto.getCompletionDate() != null && dto.getCompletionDate().isBefore(dto.getLaunchDate())) {
            throw new BadRequestException("Invalid Timeline: Completion date cannot be prior to the launch date.");
        }

        MissionStatus parsedStatus;
        try {
            parsedStatus = MissionStatus.valueOf(dto.getStatus().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Unsupported mission status state value: " + dto.getStatus());
        }

        Mission missionEntity = missionMapper.toEntity(dto, leader, area, parsedStatus);
        
        Mission savedMission = missionRepository.save(missionEntity);
        return missionMapper.toResponseDTO(savedMission, 0L); 
    }

    @Transactional(readOnly = true)
    public Page<MissionResponseDTO> getPaginatedMissions(Pageable pageable) {
    	
        // Retrieve the database-level paginated page slice
        Page<Mission> missionPage = missionRepository.findAllPaginated(pageable);
        
        // Map the entities to DTOs within the page slice
        return missionPage.map(mission -> {
            long samplesCount = missionRepository.countSamplesByMissionId(mission.getId());
            return missionMapper.toResponseDTO(mission, samplesCount);
        });
    }
    
    
    @Transactional(readOnly = true)
    public MissionResponseDTO getMissionById(UUID id) {
    	
        Mission mission = missionRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mission workspace not found with ID: " + id));
        
        missionRepository.findByIdWithSpecies(id);
        missionRepository.findByIdWithSamples(id);
        
        // Pre-compute aggregate total metrics
        long samplesCount = missionRepository.countSamplesByMissionId(id);
        
        return missionMapper.toResponseDTO(mission, samplesCount);
    }
    
    @Transactional
    public MissionResponseDTO updateMission(UUID id, MissionUpdateDTO dto) {
        Mission mission = missionRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mission workspace not found with ID: " + id));

        User leader = userRepository.findById(dto.getLeadResearcherId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned researcher profile does not exist."));

        ResearchArea area = areaRepository.findById(dto.getResearchAreaId())
                .orElseThrow(() -> new ResourceNotFoundException("Target geographical research area does not exist."));

        if (dto.getCompletionDate() != null && dto.getCompletionDate().isBefore(dto.getLaunchDate())) {
            throw new BadRequestException("Invalid Timeline: Completion date cannot be prior to the launch date.");
        }

        MissionStatus parsedStatus;
        try {
            parsedStatus = MissionStatus.valueOf(dto.getStatus().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Unsupported mission status state value: " + dto.getStatus());
        }

        
        mission.setLaunchDate(dto.getLaunchDate());
        mission.setCompletionDate(dto.getCompletionDate());
        mission.setStatus(parsedStatus);
        mission.setLeadResearcher(leader);
        mission.setResearchArea(area);
        mission.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        if (dto.getImageUrl() != null) {
            mission.setImageUrl(dto.getImageUrl().trim());
        }

        
        Mission updatedMission = missionRepository.save(mission);
        long samplesCount = missionRepository.countSamplesByMissionId(id);
        
        return missionMapper.toResponseDTO(updatedMission, samplesCount);
    }
    
}