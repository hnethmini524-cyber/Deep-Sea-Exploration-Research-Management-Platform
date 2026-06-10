package com.deepsea.deep_sea.service.impl;

import com.deepsea.deep_sea.dto.AuthResponseDTO;
import com.deepsea.deep_sea.dto.RegistrationRequestDTO;
import com.deepsea.deep_sea.exception.BadRequestException;
import com.deepsea.deep_sea.mapper.UserMapper;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.VerificationToken;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.repository.UserRepository;
import com.deepsea.deep_sea.repository.VerificationTokenRepository;
import com.deepsea.deep_sea.security.DeepSeaUserDetails;
import com.deepsea.deep_sea.service.AuthenticationService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final UserMapper userMapper;
    private final UserDetailsService userDetailsService;

    private final SecretKey secretKey;
    private final long jwtExpirationInMs;

    @Value("${app.auth.org-domain:@deepsearesearch.org}")
    private String orgDomain;

    @Value("${app.auth.confirmation-base-url}")
    private String confirmationBaseUrl;

    public AuthenticationServiceImpl(
            UserRepository userRepository,
            VerificationTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            UserMapper userMapper,
            UserDetailsService userDetailsService,
            @Value("${app.security.jwt.secret:Your_SecretSecureKey}") String secret,
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
    public void register(RegistrationRequestDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        UserRole role = email.endsWith(orgDomain.toLowerCase()) ? UserRole.RESEARCHER : UserRole.PUBLIC;
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User user = userMapper.toEntity(dto, encodedPassword, role);
        User savedUser = userRepository.save(user);

        String tokenStr = UUID.randomUUID().toString();
        tokenRepository.save(new VerificationToken(tokenStr, savedUser));

        sendVerificationEmail(savedUser.getEmail(), tokenStr);
    }

    @Override
    public void verifyEmail(String tokenString) {
        VerificationToken token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new BadRequestException("Provided account confirmation reference token is invalid."));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification timeline expired. Please register your request profile again.");
        }

        User user = token.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        tokenRepository.delete(token);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO login(String email, String password) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials profile matching email or verification password."));

        if (!user.isEnabled()) {
            throw new BadRequestException("Access Deferred: Account pending confirmation verification link activation.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials profile matching email or verification password.");
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

    private void sendVerificationEmail(String email, String token) {
        String url = confirmationBaseUrl + "/api/v1/auth/confirm?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Deep Sea Platform - Verify Account Authorization");
        message.setText("Welcome to the Deep Sea Exploration Telemetry System.\n\n" +
                        "To initialize your platform link access, click the secure link below:\n\n" +
                        url);

        mailSender.send(message);
    }
}