package com.deepsea.deep_sea.dto;

//import com.deepsea.deep_sea.model.Sample;
import com.deepsea.deep_sea.model.enums.SampleType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SampleResponseDTO {
    private UUID sampleId;
    private SampleType type;
    private LocalDateTime collectionDate;
    private String notes;
    private String imageUrl;
    
    // Connected Mission Context
    private UUID missionId;
    private String missionCodeName;
    private String missionImageUrl;
    
    // Research Area Context 
    private UUID researchAreaId;
    private String researchAreaName;
    private String geographicRegion;
    
    private UUID collectedById;
    private String collectorName;

}