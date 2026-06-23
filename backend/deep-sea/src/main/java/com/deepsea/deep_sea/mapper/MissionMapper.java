package com.deepsea.deep_sea.mapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.dto.SpeciesResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import org.springframework.stereotype.Component;

@Component
public class MissionMapper {

    private final SampleMapper sampleMapper;
    private final SpeciesMapper speciesMapper;

    public MissionMapper(SampleMapper sampleMapper, SpeciesMapper speciesMapper) {
        this.sampleMapper = sampleMapper;
        this.speciesMapper = speciesMapper;
    }

    public Mission toEntity(MissionRequestDTO dto, User leadResearcher, ResearchArea researchArea, MissionStatus status) {
        if (dto == null) return null;

        return Mission.builder()
                .codeName(dto.getCodeName().trim())
                .launchDate(dto.getLaunchDate())
                .completionDate(dto.getCompletionDate())
                .status(status)
                .description(dto.getDescription() != null ? dto.getDescription().trim() : null)
                .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl().trim() : null)
                .leadResearcher(leadResearcher)
                .researchArea(researchArea)
                .build();
    }

    public MissionResponseDTO toResponseDTO(Mission mission, long totalSamplesCount) {
        if (mission == null) return null;

        // Gather basic string listing overview values
        List<String> speciesNames = (mission.getSpecies() != null) 
            ? mission.getSpecies().stream().map(s -> s.getCommonName()).toList()
            : Collections.emptyList();

        List<SampleResponseDTO> sampleDTOs = (mission.getSamples() != null)
            ? mission.getSamples().stream().map(sampleMapper::toResponseDTO).toList()
            : Collections.emptyList();

        List<SpeciesResponseDTO> speciesDTOs = (mission.getSpecies() != null)
            ? mission.getSpecies().stream().map(speciesMapper::toResponseDTO).toList()
            : Collections.emptyList();

        return MissionResponseDTO.builder()
                .id(mission.getId())
                .codeName(mission.getCodeName())
                .launchDate(mission.getLaunchDate())
                .completionDate(mission.getCompletionDate())
                .status(mission.getStatus())
                .description(mission.getDescription())
                .imageUrl(mission.getImageUrl())
                .leadResearcherId(mission.getLeadResearcher() != null ? mission.getLeadResearcher().getId(): null)
                .leadResearcherName(mission.getLeadResearcher() != null? mission.getLeadResearcher().getName(): "Unassigned")
                .researchAreaId(mission.getResearchArea().getId())
                .researchAreaName(mission.getResearchArea().getAreaName())
                .totalSamplesLogged(totalSamplesCount)
                .samples(sampleDTOs)   
                .species(speciesDTOs) 
                .build();
    }
}