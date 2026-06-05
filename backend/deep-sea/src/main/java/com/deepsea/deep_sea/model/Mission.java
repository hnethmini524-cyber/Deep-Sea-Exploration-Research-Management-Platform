package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "missions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Mission code name is required")
    @Column(nullable = false, unique = true, length = 100)
    private String codeName;

    @NotNull(message = "Launch date is required")
    @Column(name = "launch_date", nullable = false)
    private LocalDate launchDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @NotBlank(message = "Status condition is required")
    @Column(nullable = false, length = 20)
    private String status; // "PLANNING", "ACTIVE", "COMPLETED"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_researcher_id", nullable = false)
    @NotNull(message = "A lead researcher must be assigned to this mission")
    private User leadResearcher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "research_area_id", nullable = false)
    @NotNull(message = "A target research area must be assigned to this mission")
    private ResearchArea researchArea;
}
