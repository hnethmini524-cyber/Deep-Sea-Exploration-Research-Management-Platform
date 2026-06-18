package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.dto.UserUpdateDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.mapper.UserMapper;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MissionRepository missionRepository; 
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, MissionRepository missionRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.missionRepository = missionRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDTO> findPaginatedResearchers(Pageable pageable) {
        // Fetches a subset page chunk of researchers matching filters
        Page<User> researcherPage = userRepository.findAllByRole(UserRole.RESEARCHER, pageable);
        
        return researcherPage.map(user -> {
            List<String> missions = userRepository.findAssignedMissionNamesByUserId(user.getId());
            return userMapper.toResponseDTO(user, missions);
        });
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel account profile not found."));
        List<String> missions = userRepository.findAssignedMissionNamesByUserId(id);
        return userMapper.toResponseDTO(user, missions);
    }

    // Edit profile parameters restricted ONLY to email and institution 
    @Transactional
    public UserResponseDTO updateProfile(UUID id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel account profile not found."));

        String targetEmail = dto.getEmail().trim().toLowerCase();
        
        if (!user.getEmail().equals(targetEmail) && userRepository.findByEmail(targetEmail).isPresent()) {
            throw new BadRequestException("Modification Aborted: Email variant tracking destination conflict.");
        }

        user.setEmail(targetEmail);
        user.setInstitution(dto.getInstitution().trim());

        User updatedUser = userRepository.save(user);
        List<String> missions = userRepository.findAssignedMissionNamesByUserId(id);
        return userMapper.toResponseDTO(updatedUser, missions);
    }

    // Clear reference pointer links to protect historical mission logging logs
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Target execution profile not found."));
        
        if (user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("Security Violation: Core platform administrator profiles cannot be dropped.");
        }
        
        List<Mission> assignedMissions = missionRepository.findAllByLeadResearcherId(id);
        
        for (Mission mission : assignedMissions) {
            mission.setLeadResearcher(null); 
        }
        missionRepository.saveAll(assignedMissions);
        
        userRepository.delete(user);
    }
}