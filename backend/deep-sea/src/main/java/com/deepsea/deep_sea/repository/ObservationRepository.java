package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.Observation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, UUID> {
    
    // Performance optimization
    @Query("SELECT o FROM Observation o JOIN FETCH o.mission JOIN FETCH o.species")
    List<Observation> findAllWithAssociations();

    List<Observation> findByMissionId(UUID missionId);
}