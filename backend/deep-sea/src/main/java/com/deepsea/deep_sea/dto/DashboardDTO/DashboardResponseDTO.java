package com.deepsea.deep_sea.dto.DashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    private DashboardSummaryDTO summary;

    private List<MonthlyMissionDTO> missionsPerMonth;

    private List<SampleTypeDTO> sampleTypes;

}
