package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.AuthResponseDTO;
import com.deepsea.deep_sea.dto.PasswordSetupRequestDTO;
import com.deepsea.deep_sea.dto.ResearcherInviteDTO;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {
    void inviteResearcher(ResearcherInviteDTO dto);
    void setupInitialPassword(PasswordSetupRequestDTO dto);
    AuthResponseDTO login(String email, String password);
    String generateToken(UserDetails userDetails);
    UserDetails validateToken(String token);
}