package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.AuthResponseDTO;
import com.deepsea.deep_sea.dto.LoginRequestDTO;
import com.deepsea.deep_sea.dto.RegistrationRequestDTO;
//import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.service.AuthenticationService;
//import com.deepsea.deep_sea.service.UserService;
import jakarta.validation.Valid;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authService;

    public AuthController(
            AuthenticationService authService
    ) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @Valid @RequestBody
            RegistrationRequestDTO dto
    ) {

        authService.register(dto);

        return ResponseEntity.ok(
                "Registration successful. Verify email."
        );
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(
            @RequestParam String token
    ) {

        authService.verifyEmail(token);

        return ResponseEntity.ok(
                "Account verified successfully."
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody
            LoginRequestDTO dto
    ) {

        return ResponseEntity.ok(
                authService.login(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );
    }
}