package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SampleRepository extends JpaRepository<Sample, UUID> {
    
    @Query("SELECT s FROM Sample s " + "JOIN FETCH s.mission m " + "JOIN FETCH m.researchArea " + "JOIN FETCH s.collectedBy")
    List<Sample> findAllWithFullContext();
}
