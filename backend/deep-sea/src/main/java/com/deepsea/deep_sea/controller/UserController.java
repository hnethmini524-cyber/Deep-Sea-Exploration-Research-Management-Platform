package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/researchers")
    public ResponseEntity<List<UserResponseDTO>> getAllResearchers() {
        // Database level filtration using modern repository custom queries
        List<UserResponseDTO> researchers = userService.findUsersByRole(UserRole.RESEARCHER);
        return ResponseEntity.ok(researchers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable UUID id) {
            UserResponseDTO userProfile = userService.findUserById(id);
            return ResponseEntity.ok(userProfile);
        }
}