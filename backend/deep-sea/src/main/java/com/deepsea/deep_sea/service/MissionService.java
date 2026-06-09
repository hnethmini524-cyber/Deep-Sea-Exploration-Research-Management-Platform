package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final UserRepository userRepository;
    private final ResearchAreaRepository areaRepository;

    public MissionService(MissionRepository missionRepository, 
                          UserRepository userRepository, 
                          ResearchAreaRepository areaRepository) {
        this.missionRepository = missionRepository;
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
    }

    @Transactional(readOnly = true)
    public List<MissionResponseDTO> getAllMissions() {
        return missionRepository.findAllWithAssociations().stream()
                .map(MissionResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public MissionResponseDTO getMissionById(UUID id) {
        return missionRepository.findById(id)
                .map(MissionResponseDTO::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("Mission workspace not found with ID: " + id));
    }

    @Transactional
    public MissionResponseDTO createMission(MissionRequestDTO dto) {
    	User leader = userRepository.findById(dto.getLeadResearcherId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned researcher profile does not exist."));

        ResearchArea area = areaRepository.findById(dto.getResearchAreaId())
                .orElseThrow(() -> new IllegalArgumentException("Target geographical research area does not exist."));

        if (UserRole.PUBLIC == leader.getRole()) {
            throw new IllegalArgumentException("Access Denied: Account type 'PUBLIC' lacks authorization to lead scientific missions.");
        }

        if (dto.getCompletionDate() != null && dto.getCompletionDate().isBefore(dto.getLaunchDate())) {
            throw new IllegalArgumentException("Invalid Timeline: Completion date cannot be prior to the launch date.");
        }

        MissionStatus parsedStatus;
        try {
            parsedStatus = MissionStatus.valueOf(dto.getStatus().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unsupported mission status state value: " + dto.getStatus());
        }

        Mission mission = Mission.builder()
                .codeName(dto.getCodeName().trim())
                .launchDate(dto.getLaunchDate())
                .completionDate(dto.getCompletionDate())
                .status(parsedStatus)
                .leadResearcher(leader)
                .researchArea(area)
                .build();

        Mission savedMission = missionRepository.save(mission);
        return MissionResponseDTO.fromEntity(savedMission);
    }
}