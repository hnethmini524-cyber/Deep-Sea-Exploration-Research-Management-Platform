package com.deepsea.deep_sea.dto.DashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {

    private long totalMissions;

    private long totalResearchers;

    private long totalSpecies;

    private long totalResearchAreas;

}
