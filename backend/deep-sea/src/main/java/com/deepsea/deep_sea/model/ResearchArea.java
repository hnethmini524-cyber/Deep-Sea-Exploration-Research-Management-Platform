package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.UUID;

@Entity
@Table(name = "research_areas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearchArea {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Area name is required")
    @Column(nullable = false, unique = true, length = 100)
    private String areaName;

    @NotBlank(message = "Geographic region is required")
    @Column(nullable = false, length = 100)
    private String region;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;
    
    @Column(name = "image_url", length = 512)
    private String imageUrl; 

    @Column(length = 1000)
    private String description;
}