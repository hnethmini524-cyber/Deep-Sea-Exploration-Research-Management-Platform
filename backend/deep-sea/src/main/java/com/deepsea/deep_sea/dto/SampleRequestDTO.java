package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SampleRequestDTO {

    @NotBlank(message = "Sample type is required")
    private String type; 

    @NotNull(message = "Collection timestamp is required")
    private LocalDateTime collectionDate;

    @NotNull(message = "Associated Mission ID is required")
    private UUID missionId;

    @NotNull(message = "Collector Staff User ID is required")
    private UUID collectedById;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}