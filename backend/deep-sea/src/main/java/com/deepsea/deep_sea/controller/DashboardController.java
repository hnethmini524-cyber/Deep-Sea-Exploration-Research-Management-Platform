package com.deepsea.deep_sea.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deepsea.deep_sea.dto.DashboardDTO.DashboardResponseDTO;
import com.deepsea.deep_sea.service.DashboardService;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard() {

        DashboardResponseDTO response = dashboardService.getDashboard();

        return ResponseEntity.ok(response);

    }

}
