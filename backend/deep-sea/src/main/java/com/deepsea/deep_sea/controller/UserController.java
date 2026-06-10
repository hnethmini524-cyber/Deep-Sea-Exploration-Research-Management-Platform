package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.service.UserService;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/researchers")
    public ResponseEntity<List<UserResponseDTO>>getResearchers() {
    	return ResponseEntity.ok(
                userService.findUsersByRole(UserRole.RESEARCHER)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO>getUserProfile(@PathVariable UUID id) {
    	return ResponseEntity.ok(userService.findUserById(id));
    }
}