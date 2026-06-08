package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.ResearchArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResearchAreaRepository extends JpaRepository<ResearchArea, UUID> {
    Optional<ResearchArea> findByAreaNameIgnoreCase(String areaName);
}