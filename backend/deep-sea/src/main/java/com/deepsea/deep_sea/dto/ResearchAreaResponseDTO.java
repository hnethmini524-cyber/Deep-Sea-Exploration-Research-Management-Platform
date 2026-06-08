package com.deepsea.deep_sea.dto;

import com.deepsea.deep_sea.model.ResearchArea;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ResearchAreaResponseDTO {
    private UUID id;
    private String areaName;
    private String region;
    private double latitude;
    private double longitude;
    private String description;

    public static ResearchAreaResponseDTO fromEntity(ResearchArea area) {
        return ResearchAreaResponseDTO.builder()
                .id(area.getId())
                .areaName(area.getAreaName())
                .region(area.getRegion())
                .latitude(area.getLatitude())
                .longitude(area.getLongitude())
                .description(area.getDescription())
                .build();
    }
}