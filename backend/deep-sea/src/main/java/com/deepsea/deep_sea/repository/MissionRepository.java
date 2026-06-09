package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.enums.MissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MissionRepository extends JpaRepository<Mission, UUID> {
    
    @Query("SELECT m FROM Mission m JOIN FETCH m.leadResearcher JOIN FETCH m.researchArea")
    List<Mission> findAllWithAssociations();

    List<Mission> findByStatus(MissionStatus status);
}
