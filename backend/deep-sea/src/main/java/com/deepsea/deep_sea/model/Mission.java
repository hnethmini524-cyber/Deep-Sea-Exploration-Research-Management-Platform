package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
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
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "image_url", length = 512)
    private String imageUrl; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MissionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_researcher_id", nullable = true) 
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User leadResearcher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "research_area_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ResearchArea researchArea;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
        name = "mission_samples",
        joinColumns = @JoinColumn(name = "mission_id"),
        inverseJoinColumns = @JoinColumn(name = "sample_id")
    )
    @Builder.Default
    private List<Sample> samples = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "mission_species",
        joinColumns = @JoinColumn(name = "mission_id"),
        inverseJoinColumns = @JoinColumn(name = "species_id")
    )
    @Builder.Default
    private List<Species> species = new ArrayList<>();
}