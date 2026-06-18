package com.deepsea.deep_sea.controller;

import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.dto.UserUpdateDTO;
import com.deepsea.deep_sea.dto.ResearcherInviteDTO;
import com.deepsea.deep_sea.service.UserService;
import com.deepsea.deep_sea.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationService authService;

    public UserController(UserService userService, AuthenticationService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/invite")
    @PreAuthorize("hasRole('ADMIN')") // Restricts invitations to Admins only
    public ResponseEntity<String> inviteResearcher(@Valid @RequestBody ResearcherInviteDTO dto) {
        authService.inviteResearcher(dto);
        return ResponseEntity.ok("Researcher onboarding configuration created. Dispatching email invite vector.");
    }

    @GetMapping("/researchers")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')")
    public ResponseEntity<Page<UserResponseDTO>> getResearchers(
            @PageableDefault(page = 0, size = 6, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(userService.findPaginatedResearchers(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')")
    public ResponseEntity<UserResponseDTO> getUserProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESEARCHER')")
    public ResponseEntity<UserResponseDTO> updateProfile(
            @PathVariable UUID id, 
            @Valid @RequestBody UserUpdateDTO updateDto) {
        return ResponseEntity.ok(userService.updateProfile(id, updateDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Restricts personal deletions to Admins only
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}