package com.deepsea.deep_sea.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.deepsea.deep_sea.dto.MissionResponseDTO;
import com.deepsea.deep_sea.dto.DashboardDTO.DashboardMissionDTO;
import com.deepsea.deep_sea.dto.DashboardDTO.DashboardResponseDTO;
import com.deepsea.deep_sea.dto.DashboardDTO.DashboardSummaryDTO;
import com.deepsea.deep_sea.dto.DashboardDTO.MonthlyMissionDTO;
import com.deepsea.deep_sea.dto.DashboardDTO.SampleTypeDTO;
import com.deepsea.deep_sea.model.Mission;
import com.deepsea.deep_sea.model.enums.SampleType;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.repository.MissionRepository;
import com.deepsea.deep_sea.repository.ResearchAreaRepository;
import com.deepsea.deep_sea.repository.SampleRepository;
import com.deepsea.deep_sea.repository.SpeciesRepository;
import com.deepsea.deep_sea.repository.UserRepository;
import com.deepsea.deep_sea.service.DashboardService;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final MissionRepository missionRepository;

    private final UserRepository userRepository;

    private final SpeciesRepository speciesRepository;

    private final SampleRepository sampleRepository;

    private final ResearchAreaRepository researchAreaRepository;

    @Override
    public DashboardResponseDTO getDashboard() {

        DashboardSummaryDTO summary = buildSummary();

        List<MonthlyMissionDTO> missionsPerMonth = buildMissionChart();

        List<SampleTypeDTO> sampleTypes = buildSampleChart();

        return DashboardResponseDTO.builder()
                .summary(summary)
                .missionsPerMonth(missionsPerMonth)
                .sampleTypes(sampleTypes)
                .recentMissions(buildRecentMissions())
                .build();
    }

    private DashboardSummaryDTO buildSummary() {

        return DashboardSummaryDTO.builder()
                .totalMissions(missionRepository.count())
                .totalResearchers(userRepository.countByRole(UserRole.RESEARCHER))
                .totalSpecies(speciesRepository.count())
                .totalResearchAreas(researchAreaRepository.count())
                .build();

    }

    private List<MonthlyMissionDTO> buildMissionChart() {

        List<Object[]> results = missionRepository.countMissionLaunchesPerMonth();

        return results.stream()

                .map(row -> {

                    Integer monthNumber = ((Number) row[0]).intValue();

                    Long total = ((Number) row[1]).longValue();

                    String monthName = Month.of(monthNumber)
                            .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

                    return MonthlyMissionDTO.builder()
                            .month(monthName)
                            .count(total)
                            .build();

                })

                .toList();

    }

    private List<SampleTypeDTO> buildSampleChart() {

        List<Object[]> results = sampleRepository.countSamplesByType();

        return results.stream()

                .map(row -> SampleTypeDTO.builder()

                        .type((SampleType) row[0])

                        .count(((Number) row[1]).longValue())

                        .build())

                .toList();

    }
    
    private DashboardMissionDTO convertMission(Mission mission){

        return DashboardMissionDTO.builder()

                .id(mission.getId())

                .codeName(mission.getCodeName())

                .description(mission.getDescription())

                .launchDate(mission.getLaunchDate())

                .completionDate(mission.getCompletionDate())

                .status(mission.getStatus().name())

                .researchAreaName(
                        mission.getResearchArea() != null
                        ? mission.getResearchArea().getAreaName()
                        : "N/A"
                )

                .build();

    }
    
    private List<DashboardMissionDTO> buildRecentMissions() {

        return missionRepository
                .findTop10RecentMissions(PageRequest.of(0, 10))
                .stream()
                .map(this::convertMission)
                .toList();
    }

}
