package com.deepsea.deep_sea.mapper;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import org.springframework.stereotype.Component;

@Component
public class MissionMapper {

 public Mission toEntity(MissionRequestDTO dto, User leadResearcher, ResearchArea researchArea, MissionStatus status) {
     if (dto == null) {
         return null;
     }

     return Mission.builder()
             .codeName(dto.getCodeName().trim())
             .launchDate(dto.getLaunchDate())
             .completionDate(dto.getCompletionDate())
             .status(status)
             .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl().trim() : null)
             .leadResearcher(leadResearcher)
             .researchArea(researchArea)
             .build();
 }

 public MissionResponseDTO toResponseDTO(Mission mission) {
     if (mission == null) {
         return null;
     }

     List<String> speciesObserved = Collections.emptyList();
     if (mission.getObservations() != null) {
         speciesObserved = mission.getObservations().stream()
                 .filter(obs -> obs.getSpecies() != null)
                 .map(obs -> obs.getSpecies().getCommonName())
                 .distinct()
                 .toList();
     }

     // Count parameters 
     long totalSamplesCount = (mission.getSamples() != null) ? mission.getSamples().size() : 0;
     long totalObservationsCount = (mission.getObservations() != null) ? mission.getObservations().size() : 0;

     return MissionResponseDTO.builder()
             .id(mission.getId())
             .codeName(mission.getCodeName())
             .launchDate(mission.getLaunchDate())
             .completionDate(mission.getCompletionDate())
             .status(mission.getStatus())
             .imageUrl(mission.getImageUrl())
             .leadResearcherId(mission.getLeadResearcher().getId())
             .leadResearcherName(mission.getLeadResearcher().getName())
             .researchAreaId(mission.getResearchArea().getId())
             .researchAreaName(mission.getResearchArea().getAreaName())
             .speciesObserved(speciesObserved)
             .totalSamplesLogged(totalSamplesCount)
             .totalObservationsLogged(totalObservationsCount)
             .build();
 }
} 