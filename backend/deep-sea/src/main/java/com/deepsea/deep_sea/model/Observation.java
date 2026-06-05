package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "observations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Observation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Min(value = 0, message = "Depth cannot be negative")
    @Max(value = 11000, message = "Depth cannot exceed known ocean depths")
    @Column(name = "depth_meters", nullable = false)
    private double depthMeters;

    @NotBlank(message = "Behavior notes cannot be blank")
    @Column(name = "behavior_notes", length = 1000, nullable = false)
    private String behaviorNotes;

    @NotNull(message = "Observation timestamp is required")
    @Column(name = "observed_at", nullable = false)
    private LocalDateTime observedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;
}
