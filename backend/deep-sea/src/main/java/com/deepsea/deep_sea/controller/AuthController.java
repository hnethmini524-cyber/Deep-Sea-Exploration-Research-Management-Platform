package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.LoginRequestDTO;
import com.deepsea.deep_sea.model.User;
//import com.deepsea.deep_sea.repository.UserRepository;
//import com.deepsea.deep_sea.repository.VerificationTokenRepository;
import com.deepsea.deep_sea.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*") // Allows react application connectivity
public class AuthController {

    private final UserService userService;
    
    public AuthController(UserService userService) {
			this.userService = userService;
	}

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
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginDto) {
        try {
            User user = userService.loginUser(loginDto.getEmail(), loginDto.getPassword());
            
            // Remove password hash before sending data across the network
            user.setPasswordHash(null); 
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getLocalizedMessage());
        }
    }
}
