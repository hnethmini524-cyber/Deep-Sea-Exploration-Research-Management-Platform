package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.MissionRequestDTO;
import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import com.deepsea.deep_sea.model.ResearchArea;
import com.deepsea.deep_sea.model.User;
import org.springframework.stereotype.Component;

@Component
public class MissionMapper {

    public Mission toEntity(MissionRequestDTO dto, User leadResearcher, ResearchArea researchArea, MissionStatus status) {
        if (dto == null) return null;

        return Mission.builder()
                .codeName(dto.getCodeName().trim())
                .launchDate(dto.getLaunchDate())
                .completionDate(dto.getCompletionDate())
                .status(status)
                .leadResearcher(leadResearcher)
                .researchArea(researchArea)
                .build();
    }

    public MissionResponseDTO toResponseDTO(Mission mission) {
        if (mission == null) return null;

        return MissionResponseDTO.builder()
                .id(mission.getId())
                .codeName(mission.getCodeName())
                .launchDate(mission.getLaunchDate())
                .completionDate(mission.getCompletionDate())
                .status(mission.getStatus())
                .leadResearcherId(mission.getLeadResearcher().getId())
                .leadResearcherName(mission.getLeadResearcher().getName())
                .researchAreaId(mission.getResearchArea().getId())
                .researchAreaName(mission.getResearchArea().getAreaName())
                .build();
    }
}
