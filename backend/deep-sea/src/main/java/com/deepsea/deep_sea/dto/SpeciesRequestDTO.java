package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SpeciesRequestDTO {

    @NotBlank(message = "Common name is required")
    @Size(max = 100)
    private String commonName;

    @NotBlank(message = "Scientific classification name is required")
    @Size(max = 150)
    private String scientificName;

    @NotBlank(message = "Marine taxonomy category is required")
    @Size(max = 50)
    private String category; 

    @Size(max = 1000)
    private String description;
    
    private String imageUrl;
}
