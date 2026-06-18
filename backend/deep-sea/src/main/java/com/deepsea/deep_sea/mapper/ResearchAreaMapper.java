package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.ResearchAreaRequestDTO;
import com.deepsea.deep_sea.dto.ResearchAreaResponseDTO;
import com.deepsea.deep_sea.model.ResearchArea;
import org.springframework.stereotype.Component;

@Component
public class ResearchAreaMapper {

    public ResearchArea toEntity(ResearchAreaRequestDTO dto) {
        if (dto == null) return null;

        return ResearchArea.builder()
                .areaName(dto.getAreaName().trim())
                .region(dto.getRegion().trim())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl().trim() : null)
                .build();
    }

    public ResearchAreaResponseDTO toResponseDTO(ResearchArea area, long missions, long species, long samples) {
        if (area == null) return null;

        return ResearchAreaResponseDTO.builder()
                .id(area.getId())
                .areaName(area.getAreaName())
                .region(area.getRegion())
                .latitude(area.getLatitude())
                .longitude(area.getLongitude())
                .description(area.getDescription())
                .imageUrl(area.getImageUrl())
                .totalMissionsLogged(missions)
                .totalSpeciesIdentified(species)
                .totalSamplesCollected(samples)
                .build();
    }
}