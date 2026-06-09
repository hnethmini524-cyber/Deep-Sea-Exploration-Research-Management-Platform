package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.ObservationRequestDTO;
import com.deepsea.deep_sea.dto.ObservationResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import com.deepsea.deep_sea.model.Observation;
import com.deepsea.deep_sea.model.Species;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.ObservationRepository;
import com.deepsea.deep_sea.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
//import java.util.UUID;

@Service
public class ObservationService {

    private final ObservationRepository observationRepository;
    private final MissionRepository missionRepository;
    private final SpeciesRepository speciesRepository;

    public ObservationService(ObservationRepository observationRepository, 
                              MissionRepository missionRepository, 
                              SpeciesRepository speciesRepository) {
        this.observationRepository = observationRepository;
        this.missionRepository = missionRepository;
        this.speciesRepository = speciesRepository;
    }

    @Transactional(readOnly = true)
    public List<ObservationResponseDTO> getAllObservations() {
        return observationRepository.findAllWithAssociations().stream()
                .map(ObservationResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public ObservationResponseDTO saveObservation(ObservationRequestDTO dto) {
        Mission mission = missionRepository.findById(dto.getMissionId())
                .orElseThrow(() -> new IllegalArgumentException("Target mission does not exist."));

        // Use type-safe Enum matching to preserve invariant domain rules
        if (MissionStatus.ACTIVE != mission.getStatus()) {
            throw new IllegalStateException("Cannot log findings. Target mission is currently: " + mission.getStatus());
        }

        Species species = speciesRepository.findById(dto.getSpeciesId())
                .orElseThrow(() -> new IllegalArgumentException("Target biological species taxonomy profile does not exist."));

        Observation observation = Observation.builder()
                .depthMeters(dto.getDepthMeters())
                .behaviorNotes(dto.getBehaviorNotes().trim())
                .observedAt(dto.getObservedAt() != null ? dto.getObservedAt() : LocalDateTime.now())
                .mission(mission)
                .species(species)
                .build();

        Observation savedLog = observationRepository.save(observation);
        return ObservationResponseDTO.fromEntity(savedLog);
    }
}