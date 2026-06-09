package com.deepsea.deep_sea.dto;

import com.deepsea.deep_sea.model.Sample;
import com.deepsea.deep_sea.model.enums.SampleType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SampleResponseDTO {
    private UUID sampleId;
    private SampleType type;
    private LocalDateTime collectionDate;
    private String notes;
    
    // Connected Mission Context
    private UUID missionId;
    private String missionCodeName;
    
    // Research Area Context 
    private UUID researchAreaId;
    private String researchAreaName;
    private String geographicRegion;
    
    private UUID collectedById;
    private String collectorName;

    public static SampleResponseDTO fromEntity(Sample sample) {
        return SampleResponseDTO.builder()
                .sampleId(sample.getId())
                .type(sample.getType())
                .collectionDate(sample.getCollectionDate())
                .notes(sample.getNotes())
                .missionId(sample.getMission().getId())
                .missionCodeName(sample.getMission().getCodeName())
                .researchAreaId(sample.getMission().getResearchArea().getId())
                .researchAreaName(sample.getMission().getResearchArea().getAreaName())
                .geographicRegion(sample.getMission().getResearchArea().getRegion())
                .collectedById(sample.getCollectedBy().getId())
                .collectorName(sample.getCollectedBy().getName())
                .build();
    }
}