package com.deepsea.deep_sea.dto.DashboardDTO;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMissionDTO {

    private UUID id;

    private String codeName;

    private String description;

    private LocalDate launchDate;

    private LocalDate completionDate;

    private String status;

    private String researchAreaName;

}
