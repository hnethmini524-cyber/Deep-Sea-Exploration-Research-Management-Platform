package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.ObservationRequestDTO;
import com.deepsea.deep_sea.dto.ObservationResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.Observation;
import com.deepsea.deep_sea.model.Species;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ObservationMapper {

    public Observation toEntity(ObservationRequestDTO dto, Mission mission, Species species) {
        if (dto == null) return null;

        return Observation.builder()
                .depthMeters(dto.getDepthMeters())
                .behaviorNotes(dto.getBehaviorNotes().trim())
                .observedAt(dto.getObservedAt() != null ? dto.getObservedAt() : LocalDateTime.now())
                .mission(mission)
                .species(species)
                .build();
    }

    public ObservationResponseDTO toResponseDTO(Observation observation) {
        if (observation == null) return null;

        return ObservationResponseDTO.builder()
                .id(observation.getId())
                .depthMeters(observation.getDepthMeters())
                .behaviorNotes(observation.getBehaviorNotes())
                .observedAt(observation.getObservedAt())
                .missionId(observation.getMission().getId())
                .speciesId(observation.getSpecies().getId())
                .speciesScientificName(observation.getSpecies().getScientificName())
                .build();
    }
}