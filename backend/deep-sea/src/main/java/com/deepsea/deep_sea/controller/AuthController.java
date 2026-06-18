package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.AuthResponseDTO;
import com.deepsea.deep_sea.dto.LoginRequestDTO;
import com.deepsea.deep_sea.dto.PasswordSetupRequestDTO;
import com.deepsea.deep_sea.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authService;

    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto.getEmail(), dto.getPassword()));
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPasswordSetup(@Valid @RequestBody PasswordSetupRequestDTO dto) {
        authService.setupInitialPassword(dto);
        return ResponseEntity.ok("Master password initialized successfully. Proceed to authentication console.");
    }
}