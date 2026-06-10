package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.AuthResponseDTO;
import com.deepsea.deep_sea.dto.RegistrationRequestDTO;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {
    void register(RegistrationRequestDTO dto);
    void verifyEmail(String tokenString);
    AuthResponseDTO login(String email, String password);
    String generateToken(UserDetails userDetails);
    UserDetails validateToken(String token);
}
