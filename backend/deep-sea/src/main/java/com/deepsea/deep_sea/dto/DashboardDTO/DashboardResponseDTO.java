package com.deepsea.deep_sea.dto.DashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.deepsea.deep_sea.dto.MissionResponseDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    private DashboardSummaryDTO summary;

    private List<MonthlyMissionDTO> missionsPerMonth;

    private List<SampleTypeDTO> sampleTypes;
    
    private List<MissionResponseDTO> recentMissions;

}
