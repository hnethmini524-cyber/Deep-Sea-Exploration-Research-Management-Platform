package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.SampleRequestDTO;
import com.deepsea.deep_sea.dto.SampleResponseDTO;
import com.deepsea.deep_sea.model.*;
import com.deepsea.deep_sea.model.enums.SampleType;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class SampleMapper {

    public Sample toEntity(SampleRequestDTO dto, SampleType type) {
        if (dto == null) return null;

        return Sample.builder()
        		.sampleCode(dto.getSampleCode())
                .type(type)
                .collectionDate(dto.getCollectionDate() != null ? dto.getCollectionDate() : LocalDateTime.now())
                .depth(dto.getDepth())
                .description(dto.getDescription() != null ? dto.getDescription().trim() : null)
                .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl().trim() : null)
                .build();
    }

    public SampleResponseDTO toResponseDTO(Sample sample) {
        if (sample == null) return null;

        return SampleResponseDTO.builder()
                .sampleId(sample.getId())
                .sampleCode(sample.getSampleCode())
                .type(sample.getType())
                .collectionDate(sample.getCollectionDate())
                .depth(sample.getDepth())
                .description(sample.getDescription())
                .imageUrl(sample.getImageUrl())
                .build();
    }
}