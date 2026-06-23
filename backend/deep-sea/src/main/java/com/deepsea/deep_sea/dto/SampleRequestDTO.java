package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SampleRequestDTO {
	
	@NotBlank(message = "Sample identification name is required")
	private String sampleCode;

    @NotBlank(message = "Sample type is required")
    private String type; 

    @NotNull(message = "Collection timestamp is required")
    private LocalDateTime collectionDate;

    private double depth; 

    private String description;
    
    private String imageUrl;
}