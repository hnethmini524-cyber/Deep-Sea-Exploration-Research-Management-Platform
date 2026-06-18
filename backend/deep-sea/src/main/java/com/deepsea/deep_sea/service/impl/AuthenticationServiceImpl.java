package com.deepsea.deep_sea.service.impl;

import com.deepsea.deep_sea.dto.AuthResponseDTO;
import com.deepsea.deep_sea.dto.ResearcherInviteDTO;
import com.deepsea.deep_sea.dto.PasswordSetupRequestDTO;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.VerificationToken;
import com.deepsea.deep_sea.mapper.UserMapper;
import com.deepsea.deep_sea.repository.UserRepository;
import com.deepsea.deep_sea.repository.VerificationTokenRepository;
import com.deepsea.deep_sea.security.DeepSeaUserDetails;
import com.deepsea.deep_sea.service.AuthenticationService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import javax.crypto.SecretKey;

@Service
@Transactional
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final UserMapper userMapper;
    private final UserDetailsService userDetailsService;
    private final SecretKey secretKey;
    private final long jwtExpirationInMs;

    @Value("${app.auth.confirmation-base-url:http://localhost:5173}")
    private String confirmationBaseUrl;

    public AuthenticationServiceImpl(
            UserRepository userRepository,
            VerificationTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            UserMapper userMapper,
            UserDetailsService userDetailsService,
            @Value("${app.security.jwt.secret:Your_SecretSecureKey_MustBeLongEnoughForHS256}") String secret,
            @Value("${app.security.jwt.expiration-ms:86400000}") long expiration
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.userMapper = userMapper;
        this.userDetailsService = userDetailsService;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationInMs = expiration;
    }

    @Override
    public void inviteResearcher(ResearcherInviteDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An operator account with this email address already exists.");
        }

        String temporaryRandomPassword = passwordEncoder.encode(UUID.randomUUID().toString());
        
        User researcher = userMapper.toInviteEntity(dto, temporaryRandomPassword);
        User savedUser = userRepository.save(researcher);

        // Create secure activation token
        String tokenStr = UUID.randomUUID().toString();
        tokenRepository.save(new VerificationToken(tokenStr, savedUser));

        sendOnboardingInvitationEmail(savedUser.getEmail(), savedUser.getName(), tokenStr);
    }

    @Override
    public void setupInitialPassword(PasswordSetupRequestDTO dto) {
        VerificationToken token = tokenRepository.findByToken(dto.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Provided account configuration reference token is invalid."));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Activation timeline expired. Please request a new invitation from your administrator.");
        }

        User user = token.getUser();
        
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(true); 
        userRepository.save(user); 

        // Delete used token from the registry after the user account is safely saved.
        tokenRepository.delete(token);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO login(String email, String password) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials profile matching email or verification password."));

        if (!user.isEnabled()) {
            throw new IllegalStateException("Access Deferred: Account pending confirmation verification link activation.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials profile matching email or verification password.");
        }

        String jwt = generateToken(new DeepSeaUserDetails(user));

        return new AuthResponseDTO(
                jwt,
                user.getEmail(),
                user.getRole(),
                user.getName()
        );
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public UserDetails validateToken(String token) {
        String email = extractClaim(token, Claims::getSubject);
        return userDetailsService.loadUserByUsername(email);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder() 
                .setSigningKey(secretKey)          
                .build()                          
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    private void sendOnboardingInvitationEmail(String email, String name, String token) {

        String url = confirmationBaseUrl + "/password?token=" + token + "&email=" + email;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OceanExplore Platform - Authorized Personnel Invitation");
        message.setText("Greetings Commander " + name + ",\n\n" +
                        "An administrator has registered your profile context onto the Deep Sea Exploration Management System Platform.\n\n" +
                        "To initialize your master password and activate your workspace profile, follow the link configuration parameter below:\n\n" +
                        url + "\n\n" +
                        "Note: This setup link window expires in exactly 24 hours.");

        mailSender.send(message);
    }
}