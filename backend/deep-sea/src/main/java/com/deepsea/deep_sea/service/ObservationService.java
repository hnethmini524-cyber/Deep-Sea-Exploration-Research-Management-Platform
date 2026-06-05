package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.ObservationRequestDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.Observation;
import com.deepsea.deep_sea.model.Species;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.ObservationRepository;
import com.deepsea.deep_sea.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Transactional
    public List<Observation> getAllObservations() {
        return observationRepository.findAll();
    }

    @Transactional
    public Observation saveObservation(ObservationRequestDTO dto) {
        Mission mission = missionRepository.findById(dto.getMissionId())
                .orElseThrow(() -> new IllegalArgumentException("Target mission does not exist."));

        // Observations can only be logged during live, ongoing operations
        if (!"ACTIVE".equalsIgnoreCase(mission.getStatus())) {
            throw new IllegalArgumentException("Cannot log findings. Target mission is currently: " + mission.getStatus());
        }

        // Verify Species profile exists
        Species species = speciesRepository.findById(dto.getSpeciesId())
                .orElseThrow(() -> new IllegalArgumentException("Target biological species taxonomy profile does not exist."));

        // Map DTO fields into the relational Entity entity wrapper
        Observation observation = new Observation();
        observation.setDepthMeters(dto.getDepthMeters());
        observation.setBehaviorNotes(dto.getBehaviorNotes().trim());
        observation.setObservedAt(dto.getObservedAt() != null ? dto.getObservedAt() : java.time.LocalDateTime.now());
        observation.setMission(mission);
        observation.setSpecies(species);

        return observationRepository.save(observation);
    }
}
