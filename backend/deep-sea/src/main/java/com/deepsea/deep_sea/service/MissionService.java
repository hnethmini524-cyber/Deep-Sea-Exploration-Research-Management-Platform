package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
//import java.util.UUID;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final UserRepository userRepository;

    public MissionService(MissionRepository missionRepository, UserRepository userRepository) {
        this.missionRepository = missionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    @Transactional
    public Mission createMission(Mission mission) {
        User leader = userRepository.findById(mission.getLeadResearcher().getId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned researcher profile does not exist."));

        if ("PUBLIC".equalsIgnoreCase(leader.getRole())) {
            throw new IllegalArgumentException("Access Denied: Account type 'PUBLIC' lacks authorization to lead missions.");
        }

        // Standardize status states
        mission.setStatus(mission.getStatus().toUpperCase().trim());
        mission.setCodeName(mission.getCodeName().trim());

        return missionRepository.save(mission);
    }
}

