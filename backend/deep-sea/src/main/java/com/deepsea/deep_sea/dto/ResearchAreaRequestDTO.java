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
    @Min(-90) @Max(90)
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @Min(-180) @Max(180)
    private Double longitude;

    @Size(max = 1000)
    private String description;

    private String imageUrl; 
}
