package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResearchAreaRequestDTO {

    @NotBlank(message = "Area name is required")
    @Size(max = 100)
    private String areaName;

    @NotBlank(message = "Geographic region is required")
    @Size(max = 100)
    private String region;

    @NotNull(message = "Latitude is required")
    @Min(value = -90, message = "Latitude must be at least -90 degrees")
    @Max(value = 90, message = "Latitude cannot exceed 90 degrees")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @Min(value = -180, message = "Longitude must be at least -180 degrees")
    @Max(value = 180, message = "Longitude cannot exceed 180 degrees")
    private Double longitude;

    @Size(max = 1000)
    private String description;
}
