package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ObservationRequestDTO {

    @NotNull(message = "Mission ID is required")
    private UUID missionId;

    @NotNull(message = "Species ID is required")
    private UUID speciesId;

    @Min(value = 0, message = "Depth cannot be negative")
    @Max(value = 11000, message = "Depth cannot exceed ocean trench maximums")
    private double depthMeters;

    @NotBlank(message = "Behavior notes cannot be blank")
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String behaviorNotes;

    private LocalDateTime observedAt;
}