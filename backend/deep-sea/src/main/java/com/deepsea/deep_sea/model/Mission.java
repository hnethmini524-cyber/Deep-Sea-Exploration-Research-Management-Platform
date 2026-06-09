package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;
import com.deepsea.deep_sea.model.enums.MissionStatus;

@Entity
@Table(name = "missions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String codeName;

    @Column(name = "launch_date", nullable = false)
    private LocalDate launchDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MissionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_researcher_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User leadResearcher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "research_area_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ResearchArea researchArea;
}