package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.SpeciesRequestDTO;
import com.deepsea.deep_sea.dto.SpeciesResponseDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.Species;
import org.springframework.stereotype.Component;

@Component
public class SpeciesMapper {

    public Species toEntity(SpeciesRequestDTO dto, Mission mission) {
        if (dto == null) return null;

        return Species.builder()
                .scientificName(dto.getScientificName().trim())
                .commonName(dto.getCommonName().trim())
                .category(dto.getCategory().trim())
                .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl().trim() : null)
                .description(dto.getDescription())
                .depth(dto.getDepth())
                .observations(dto.getObservations().trim())
                .mission(mission)
                .build();
    }

    public SpeciesResponseDTO toResponseDTO(Species species) {
        if (species == null) return null;

        return SpeciesResponseDTO.builder()
                .id(species.getId())
                .commonName(species.getCommonName())
                .scientificName(species.getScientificName())
                .category(species.getCategory())
                .imageUrl(species.getImageUrl())
                .description(species.getDescription())
                .depth(species.getDepth())
                .observations(species.getObservations())
                .missionId(species.getMission() != null ? species.getMission().getId() : null)
                .build();
    }
}