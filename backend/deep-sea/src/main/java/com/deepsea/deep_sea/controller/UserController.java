package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*") // To react integration
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Used by Admin/Researchers to view all scientific staff
    @GetMapping("/researchers")
    public ResponseEntity<List<User>> getAllResearchers() {
        // Fetch only users who are actual internal staff members
        List<User> researchers = userRepository.findAll().stream()
                .filter(user -> "RESEARCHER".equalsIgnoreCase(user.getRole()))
                .toList();
        return ResponseEntity.ok(researchers);
    }

    // Used to load an individual researcher's profile page
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setPasswordHash(null);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}