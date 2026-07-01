package com.deepsea.deep_sea.dto.DashboardDTO;

import com.deepsea.deep_sea.model.enums.SampleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SampleTypeDTO {

    private SampleType type;

    private Long count;

}
