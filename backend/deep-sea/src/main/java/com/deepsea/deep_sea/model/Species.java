package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "species")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Species {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Common name is required")
    @Column(nullable = false, length = 100)
    private String commonName;

    @NotBlank(message = "Scientific classification name is required")
    @Column(nullable = false, unique = true, length = 150)
    private String scientificName;

    @NotBlank(message = "Marine taxonomy category is required")
    @Column(nullable = false, length = 50)
    private String category; 
    
    @Column(name = "image_url", length = 512)
    private String imageUrl; 
    
    @Column(nullable = false)
    private double depth;

    @Column(columnDefinition = "TEXT") 
    private String observations;

    @Column(length = 1000)
    private String description;
    
    @ManyToMany(mappedBy = "species")
    @Builder.Default
    private List<Mission> missions = new ArrayList<>();
}
