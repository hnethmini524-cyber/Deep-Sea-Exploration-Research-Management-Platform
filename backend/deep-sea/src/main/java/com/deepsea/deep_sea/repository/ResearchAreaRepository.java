package com.deepsea.deep_sea.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.deepsea.deep_sea.model.ResearchArea;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResearchAreaRepository extends JpaRepository<ResearchArea, UUID> {
    
    Optional<ResearchArea> findByAreaNameIgnoreCase(String areaName);

    // Optimized paginated selector
    @Query(value = "SELECT r FROM ResearchArea r", countQuery = "SELECT COUNT(r) FROM ResearchArea r")
    Page<ResearchArea> findAllPaginated(Pageable pageable);

    @Query("SELECT COUNT(m) FROM Mission m WHERE m.researchArea.id = :areaId")
    long countMissionsByAreaId(@Param("areaId") UUID areaId);

    @Query("SELECT COUNT(DISTINCT s) FROM Species s WHERE s.mission.researchArea.id = :areaId")
    long countSpeciesByAreaId(@Param("areaId") UUID areaId);

    @Query("SELECT COUNT(sm) FROM Sample sm WHERE sm.mission.researchArea.id = :areaId")
    long countSamplesByAreaId(@Param("areaId") UUID areaId);
}