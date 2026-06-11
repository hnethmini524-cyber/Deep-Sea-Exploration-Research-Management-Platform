package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import com.deepsea.deep_sea.model.enums.SampleType;
import lombok.*;
import java.time.LocalDateTime;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SampleType type;

    @Column(name = "collection_date", nullable = false)
    private LocalDateTime collectionDate;

    @Column(length = 1000)
    private String notes;
    
    @Column(name = "image_url", length = 512)
    private String imageUrl; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Mission mission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collected_by_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User collectedBy;
}
