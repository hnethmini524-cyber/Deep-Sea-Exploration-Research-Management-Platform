package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, UUID> {
    Optional<Species> findByScientificNameIgnoreCase(String scientificName);
}
