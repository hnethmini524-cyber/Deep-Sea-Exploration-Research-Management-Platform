package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*") // Allows react application connectivity
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> registerUserAccount(@Valid @RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("Registration initialized successfully. Please check your inbox for a verification email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected execution error occurred during onboarding.");
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
}
