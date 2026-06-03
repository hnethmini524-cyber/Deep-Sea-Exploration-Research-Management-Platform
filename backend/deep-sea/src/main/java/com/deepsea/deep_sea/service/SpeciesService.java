package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.model.Species;
import com.deepsea.deep_sea.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class SpeciesService {

    private final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    @Transactional
    public List<Species> getAllSpecies() {
        return speciesRepository.findAll();
    }

    @Transactional
    public Species getSpeciesById(UUID id) {
        return speciesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Species profile not found with ID: " + id));
    }

    @Transactional
    public Species addSpecies(Species species) {
        // Match taxonomy strictly via standard universal scientific naming
        String stylizedScientificName = species.getScientificName().trim();
        if (speciesRepository.findByScientificNameIgnoreCase(stylizedScientificName).isPresent()) {
            throw new IllegalArgumentException("Species classification '" + stylizedScientificName + "' is already registered.");
        }

        species.setScientificName(stylizedScientificName);
        species.setCommonName(species.getCommonName().trim());
        
        return speciesRepository.save(species);
    }
}
