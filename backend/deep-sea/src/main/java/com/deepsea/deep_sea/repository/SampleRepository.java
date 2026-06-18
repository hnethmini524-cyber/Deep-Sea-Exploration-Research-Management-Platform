package com.deepsea.deep_sea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.deepsea.deep_sea.model.Sample;

import java.util.UUID;

@Repository
public interface SampleRepository extends JpaRepository<Sample, UUID> {
}