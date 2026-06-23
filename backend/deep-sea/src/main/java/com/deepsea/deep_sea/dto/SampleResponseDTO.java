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
    private String sampleCode;
    private SampleType type;
    private LocalDateTime collectionDate;
    private double depth;
    private String description;
    private String imageUrl;
    
}