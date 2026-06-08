package com.deepsea.deep_sea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

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

    @Column(length = 1000)
    private String description;
}
