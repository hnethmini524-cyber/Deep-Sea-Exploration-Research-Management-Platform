package com.deepsea.deep_sea.dto;

import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class MissionResponseDTO {
    private UUID id;
    private String codeName;
    private LocalDate launchDate;
    private LocalDate completionDate;
    private MissionStatus status;
    private UUID leadResearcherId;
    private String leadResearcherName;
    private UUID researchAreaId;
    private String researchAreaName;

    public static MissionResponseDTO fromEntity(Mission mission) {
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
