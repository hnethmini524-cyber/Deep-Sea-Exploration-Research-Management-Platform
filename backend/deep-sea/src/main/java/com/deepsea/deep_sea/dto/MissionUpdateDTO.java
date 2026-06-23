package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class MissionUpdateDTO {

    @NotNull(message = "Launch date is required")
    private LocalDate launchDate;

    private LocalDate completionDate;

    @NotBlank(message = "Status condition is required")
    @Size(max = 20)
    private String status; 

    @NotNull(message = "A lead researcher ID must be assigned")
    private UUID leadResearcherId;

    @NotNull(message = "A target research area ID must be assigned")
    private UUID researchAreaId;
    
    private String imageUrl;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    private List<UUID> sampleIds;

    // NEW
    private List<UUID> speciesIds;
}
