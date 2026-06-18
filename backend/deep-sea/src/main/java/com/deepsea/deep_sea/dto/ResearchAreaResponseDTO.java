package com.deepsea.deep_sea.dto;

//import com.deepsea.deep_sea.model.ResearchArea;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ResearchAreaResponseDTO {
    private UUID id;
    private String areaName;
    private String region;
    private double latitude;
    private double longitude;
    private String description;
    private String imageUrl; 

    // System requirements metrics 
    private long totalMissionsLogged;
    private long totalSpeciesIdentified;
    private long totalSamplesCollected;
}