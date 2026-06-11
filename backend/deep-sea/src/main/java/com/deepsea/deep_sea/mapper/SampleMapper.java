package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.SampleRequestDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.model.*;
import com.deepsea.deep_sea.model.enums.SampleType;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class SampleMapper {

    public Sample toEntity(SampleRequestDTO dto, Mission mission, User collector) {
        if (dto == null) return null;

        SampleType parsedType = null;
        if (dto.getType() != null) {
            parsedType = SampleType.valueOf(dto.getType().toUpperCase().trim());
        }

        return Sample.builder()
                .type(parsedType)
                .collectionDate(dto.getCollectionDate() != null ? dto.getCollectionDate() : LocalDateTime.now())
                .notes(dto.getNotes() != null ? dto.getNotes().trim() : null)
                .mission(mission)
                .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl().trim() : null)
                .collectedBy(collector)
                .build();
    }

    public SampleResponseDTO toResponseDTO(Sample sample) {
        if (sample == null) return null;

        // Context Null-Safeguards
        UUID missionId = null;
        String missionCodeName = null;
        String missionImageUrl = null;
        UUID researchAreaId = null;
        String researchAreaName = null;
        String geographicRegion = null;

        if (sample.getMission() != null) {
            Mission mission = sample.getMission();
            missionId = mission.getId();
            missionCodeName = mission.getCodeName();
            missionImageUrl = mission.getImageUrl();

            if (mission.getResearchArea() != null) {
                ResearchArea area = mission.getResearchArea();
                researchAreaId = area.getId();
                researchAreaName = area.getAreaName();
                geographicRegion = area.getRegion();
            }
        }

        UUID collectedById = (sample.getCollectedBy() != null) ? sample.getCollectedBy().getId() : null;
        String collectorName = (sample.getCollectedBy() != null) ? sample.getCollectedBy().getName() : null;

        return SampleResponseDTO.builder()
                .sampleId(sample.getId())
                .type(sample.getType())
                .collectionDate(sample.getCollectionDate())
                .notes(sample.getNotes())
                .missionId(missionId)
                .missionCodeName(missionCodeName)
                .imageUrl(sample.getImageUrl())
                .researchAreaId(researchAreaId)
                .missionImageUrl(missionImageUrl)
                .researchAreaName(researchAreaName)
                .geographicRegion(geographicRegion)
                .collectedById(collectedById)
                .collectorName(collectorName)
                .build();
    }
}
