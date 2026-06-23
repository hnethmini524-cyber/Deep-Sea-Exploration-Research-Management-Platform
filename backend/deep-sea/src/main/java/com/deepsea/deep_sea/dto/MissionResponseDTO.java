package com.deepsea.deep_sea.dto;

import com.deepsea.deep_sea.model.enums.MissionStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class MissionResponseDTO {
    private UUID id;
    private String codeName;
    private LocalDate launchDate;
    private LocalDate completionDate;
    private MissionStatus status;
    private String description;
    private UUID leadResearcherId;
    private String leadResearcherName;
    private UUID researchAreaId;
    private String researchAreaName;
    private String imageUrl;
    
    private long totalSamplesLogged;

    // detailed collections
    private List<SampleResponseDTO> samples;
    private List<SpeciesResponseDTO> species; 
}
