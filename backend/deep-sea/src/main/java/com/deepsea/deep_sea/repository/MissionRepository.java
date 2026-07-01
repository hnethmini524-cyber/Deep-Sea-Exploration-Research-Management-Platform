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

    @Query("SELECT COUNT(s) FROM Mission m JOIN m.samples s WHERE m.id = :id")
    long countSamplesByMissionId(@Param("id") UUID id);
    
    @Query("SELECT m FROM Mission m JOIN FETCH m.leadResearcher JOIN FETCH m.researchArea WHERE m.id = :id")
    Optional<Mission> findByIdWithAssociations(@Param("id") UUID id);

    @Query("""
    		SELECT DISTINCT m
    		FROM Mission m
    		LEFT JOIN FETCH m.leadResearcher
    		LEFT JOIN FETCH m.researchArea
    		LEFT JOIN FETCH m.samples
    		LEFT JOIN FETCH m.species
    		WHERE m.id = :id
    		""")
    		Optional<Mission> findDetailedMission(@Param("id") UUID id);

    @Query(value = "SELECT * FROM missions ORDER BY launch_date DESC LIMIT 10", nativeQuery = true)
    List<Mission> findTop10RecentMissions();
    
    List<Mission> findAllByLeadResearcherId(UUID researcherId);
    
    @Query(value = """
    		SELECT
    		MONTH(launch_date) AS month,
    		COUNT(*) AS total
    		FROM missions
    		GROUP BY MONTH(launch_date)
    		ORDER BY MONTH(launch_date)
    		""", nativeQuery = true)
    		List<Object[]> countMissionLaunchesPerMonth();
}