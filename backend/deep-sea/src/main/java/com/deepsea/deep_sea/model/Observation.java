package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "observations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Observation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "depth_meters", nullable = false)
    private double depthMeters;

    @Column(name = "behavior_notes", length = 1000, nullable = false)
    private String behaviorNotes;

    @Column(name = "observed_at", nullable = false)
    private LocalDateTime observedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    @ToString.Exclude // Prevents unintended proxy initialization during logging loops
    @EqualsAndHashCode.Exclude
    private Mission mission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Species species;
}