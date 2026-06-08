package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.RegistrationRequestDTO;
import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.model.VerificationToken;
import com.deepsea.deep_sea.repository.UserRepository;
import com.deepsea.deep_sea.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.auth.org-domain:@deepsearesearch.org}")
    private String orgDomain;

    @Value("${app.auth.confirmation-base-url:http://localhost:8080}")
    private String confirmationBaseUrl;
    
    public UserService(UserRepository userRepository, 
                       VerificationTokenRepository tokenRepository, 
                       BCryptPasswordEncoder passwordEncoder, 
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void registerUser(RegistrationRequestDTO dto) {
        String standardizedEmail = dto.getEmail().toLowerCase().trim();
        
        if (userRepository.findByEmail(standardizedEmail).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        UserRole assignedRole = standardizedEmail.endsWith(orgDomain.toLowerCase()) 
                ? UserRole.RESEARCHER 
                : UserRole.PUBLIC;

        User user = User.builder()
                .name(dto.getName())
                .email(standardizedEmail)
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .role(assignedRole)
                .specialization(assignedRole == UserRole.RESEARCHER ? dto.getSpecialization() : null)
                .institution(assignedRole == UserRole.RESEARCHER ? dto.getInstitution() : null)
                .enabled(false)
                .build();

        User savedUser = userRepository.save(user);
        String tokenStr = UUID.randomUUID().toString();
        
        VerificationToken verificationToken = new VerificationToken(tokenStr, savedUser);
        tokenRepository.save(verificationToken);

        sendVerificationEmail(savedUser.getEmail(), tokenStr);
    }

    @Transactional
    public boolean validateVerificationToken(String tokenStr) {
        VerificationToken token = tokenRepository.findByToken(tokenStr).orElse(null);

        if (token == null || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        User user = token.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        
        tokenRepository.delete(token);
        return true;
    }
    
    @Transactional(readOnly = true)
    public UserResponseDTO loginUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!user.isEnabled()) {
            throw new IllegalStateException("Please verify your email address via the link sent to your inbox before logging in.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return UserResponseDTO.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> findUsersByRole(UserRole role) {
        return userRepository.findAllByRole(role).stream()
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserResponseDTO::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found."));
    }

    private void sendVerificationEmail(String recipientEmail, String token) {
        String confirmationUrl = confirmationBaseUrl + "/api/v1/auth/confirm?token=" + token;
        
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientEmail);
        email.setSubject("Deep Sea Platform - Verify Your Account Email");
        email.setText("Welcome to the Deep Sea Exploration Platform.\n\n" +
                      "To activate your account and access your dashboard, please click the link below:\n" + 
                      confirmationUrl + "\n\n" +
                      "Note: This link will expire in 24 hours.");
        
        mailSender.send(email);
    }
}