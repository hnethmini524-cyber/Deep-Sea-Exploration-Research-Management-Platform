package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.Mission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MissionRepository extends JpaRepository<Mission, UUID> {

    @Query(value = "SELECT m FROM Mission m " +
                   "JOIN FETCH m.leadResearcher " +
                   "JOIN FETCH m.researchArea",
           countQuery = "SELECT COUNT(m) FROM Mission m")
    Page<Mission> findAllPaginated(Pageable pageable);

    @Query("SELECT COUNT(s) FROM Sample s WHERE s.mission.id = :missionId")
    long countSamplesByMissionId(@Param("missionId") UUID missionId);
    
    @Query("SELECT m FROM Mission m JOIN FETCH m.leadResearcher JOIN FETCH m.researchArea WHERE m.id = :id")
    Optional<Mission> findByIdWithAssociations(@Param("id") UUID id);

    // Join for species collection
    @Query("SELECT m FROM Mission m LEFT JOIN FETCH m.species WHERE m.id = :id")
    Optional<Mission> findByIdWithSpecies(@Param("id") UUID id);

    // Join for samples collection
    @Query("SELECT m FROM Mission m LEFT JOIN FETCH m.samples WHERE m.id = :id")
    Optional<Mission> findByIdWithSamples(@Param("id") UUID id);

    @Query(value = "SELECT * FROM missions ORDER BY launch_date DESC LIMIT 10", nativeQuery = true)
    List<Mission> findTop10RecentMissions();
    
    List<Mission> findAllByLeadResearcherId(UUID researcherId);
}