package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.VerificationToken;
import com.deepsea.deep_sea.repository.UserRepository;
import com.deepsea.deep_sea.repository.VerificationTokenRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

	private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private static final String ORG_DOMAIN = "@deepsearesearch.org";
    
    public UserService(UserRepository userRepository, 
            VerificationTokenRepository tokenRepository, BCryptPasswordEncoder passwordEncoder, JavaMailSender mailSender) {
			this.userRepository = userRepository;
			this.tokenRepository = tokenRepository;
			this.passwordEncoder = passwordEncoder;
			this.mailSender = mailSender;
			}

    @Transactional
    public void registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        // Encrypt sensitive password
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // Evaluate domain authorization
        if (user.getEmail().toLowerCase().trim().endsWith(ORG_DOMAIN)) {
            user.setRole("RESEARCHER");
        } else {
            user.setRole("PUBLIC");
            user.setSpecialization(null); 
            user.setInstitution(null);
        }

        // Force strict disabled state until email confirmation occurs
        user.setEnabled(false);
        User savedUser = userRepository.save(user);

        // Generate and store unique verification token
        String tokenStr = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(tokenStr, savedUser);
        tokenRepository.save(verificationToken);

        sendVerificationEmail(savedUser.getEmail(), tokenStr);
    }

    private void sendVerificationEmail(String recipientEmail, String token) {
        String confirmationUrl = "http://localhost:8080/api/v1/auth/confirm?token=" + token;
        
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientEmail);
        email.setSubject("Deep Sea Platform - Verify Your Account Email");
        email.setText("Welcome to the Deep Sea Exploration Platform.\n\n" +
                     "To activate your account and access your dashboard, please click the link below:\n" + 
                     confirmationUrl + "\n\n" +
                     "Note: This link will expire in 24 hours.");
        
        mailSender.send(email);
    }

    @Transactional
    public boolean validateVerificationToken(String tokenStr) {
        VerificationToken token = tokenRepository.findByToken(tokenStr).orElse(null);

        // Fail fast if token does not exist or has passed its expiry window
        if (token == null || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Activate matching user
        User user = token.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        
        // Purge token to ensure single-use integrity
        tokenRepository.delete(token);
        return true;
    }
    
    @Transactional
    public User loginUser(String email, String rawPassword) {
        // Check if the user exists
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        // Ensure they verified their email link first
        if (!user.isEnabled()) {
            throw new IllegalStateException("Please verify your email address via the link sent to your inbox before logging in.");
        }

        // Verify the password hash matches the raw input
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // Return the authenticated user 
        return user;
    }
}