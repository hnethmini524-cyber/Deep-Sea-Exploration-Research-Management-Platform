package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data 
@NoArgsConstructor
@AllArgsConstructor
public class ObservationRequestDTO {

    @NotNull(message = "Mission ID is required")
    private UUID missionId;

    @NotNull(message = "Species ID is required")
    private UUID speciesId;

    @Min(value = 0, message = "Depth cannot be negative")
    @Max(value = 11000, message = "Depth cannot exceed ocean trench maximums")
    private double depthMeters;

    @NotBlank(message = "Behavior notes cannot be blank")
    private String behaviorNotes;

    private LocalDateTime observedAt = LocalDateTime.now();
}
