package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MissionRepository extends JpaRepository<Mission, UUID> {
    
    List<Mission> findByStatusIgnoreCase(String status);
}
