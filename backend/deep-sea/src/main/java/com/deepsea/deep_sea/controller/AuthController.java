package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.LoginRequestDTO;
import com.deepsea.deep_sea.dto.RegistrationRequestDTO;
import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class AuthController {

    private final UserService userService;
    
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registerUserAccount(@Valid @RequestBody RegistrationRequestDTO registrationDto) {
        try {
            userService.registerUser(registrationDto);
            return ResponseEntity.ok("Registration initialized successfully. Please check your inbox for a verification email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected execution error occurred during onboarding.");
        }
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirmRegistrationToken(@RequestParam("token") String token) {
        boolean isVerified = userService.validateVerificationToken(token);
        
        if (!isVerified) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Verification token is either malformed, invalid, or expired.");
        }
        
        return ResponseEntity.ok("Account successfully activated! You can now access your profile via the login window.");
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginDto) {
        try {
            UserResponseDTO authenticatedUser = userService.loginUser(loginDto.getEmail(), loginDto.getPassword());
            return ResponseEntity.ok(authenticatedUser);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getLocalizedMessage());
        }
    }
}