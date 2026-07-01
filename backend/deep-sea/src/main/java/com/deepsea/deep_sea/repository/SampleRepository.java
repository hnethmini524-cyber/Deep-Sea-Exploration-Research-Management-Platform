package com.deepsea.deep_sea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.deepsea.deep_sea.model.Sample;

import java.util.List;
import java.util.UUID;

@Repository
public interface SampleRepository extends JpaRepository<Sample, UUID> {
	
	@Query("""
			SELECT s.type, COUNT(s)
			FROM Sample s
			GROUP BY s.type
			""")
			List<Object[]> countSamplesByType();
}