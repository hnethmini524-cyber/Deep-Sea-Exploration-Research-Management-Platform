package com.deepsea.deep_sea.dto;

//import com.deepsea.deep_sea.model.Observation;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ObservationResponseDTO {
    private UUID id;
    private double depthMeters;
    private String behaviorNotes;
    private LocalDateTime observedAt;
    private UUID missionId;
    private UUID speciesId;
    private String speciesScientificName;

}
