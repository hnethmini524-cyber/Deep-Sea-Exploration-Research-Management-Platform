package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import com.deepsea.deep_sea.model.enums.SampleType;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "samples")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sample {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "sample_code", nullable = false, unique = true, length = 50)
    private String sampleCode; // e.g., "SAMP-2026-0042", "BIO-DEEP-01"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SampleType type;

    @Column(name = "collection_date", nullable = false)
    private LocalDateTime collectionDate;

    @Column(nullable = false)
    private double depth; 

    @Column(length = 1500)
    private String description;
    
    @Column(name = "image_url", length = 512)
    private String imageUrl; 
    
    @ManyToMany(mappedBy = "samples")
    @Builder.Default
    private List<Mission> missions = new ArrayList<>();

}
