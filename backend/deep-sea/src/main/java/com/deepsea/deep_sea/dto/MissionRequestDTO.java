package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class MissionRequestDTO {

    @NotBlank(message = "Mission code name is required")
    @Size(max = 100)
    private String codeName;

    @NotNull(message = "Launch date is required")
    private LocalDate launchDate;

    private LocalDate completionDate;

    @NotBlank(message = "Status condition is required")
    @Size(max = 20)
    private String status; 
    private String description;

    private UUID leadResearcherId;

    @NotNull(message = "A target research area ID must be assigned")
    private UUID researchAreaId;
    
    private String imageUrl;
    
    private List<UUID> sampleIds;

    private List<UUID> speciesIds;
    
}