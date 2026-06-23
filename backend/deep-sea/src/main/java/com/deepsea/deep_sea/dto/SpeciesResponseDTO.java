package com.deepsea.deep_sea.dto;

//import com.deepsea.deep_sea.model.Species;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SpeciesResponseDTO {
    private UUID id;
    private String commonName;
    private String scientificName;
    private String category;
    private String description;
    private String imageUrl;
    private double depth;
    private String observations;
    
}
