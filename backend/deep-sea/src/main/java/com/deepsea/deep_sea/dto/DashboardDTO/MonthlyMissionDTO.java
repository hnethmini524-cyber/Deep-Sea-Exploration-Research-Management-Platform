package com.deepsea.deep_sea.dto.DashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyMissionDTO {

    private String month;

    private Long count;

}
