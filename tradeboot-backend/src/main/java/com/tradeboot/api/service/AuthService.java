package com.tradeboot.api.service;

import com.tradeboot.api.model.*;
import com.tradeboot.api.repository.UserRepository;
import com.tradeboot.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(UserRepository repository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager, EmailService emailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    private String generateOtp() {
        int otp = 100000 + new java.util.Random().nextInt(900000);
        return String.valueOf(otp);
    }

    public AuthResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User(
                null,
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.USER,
                java.time.LocalDateTime.now()
        );
        
        user.setVerified(false);
        user.setOtp(generateOtp());
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
                
        repository.save(user);

        // Send OTP
        emailService.sendOtpEmail(user.getEmail(), user.getOtp());
        
        // Don't issue token until verified
        return new AuthResponse(null, UserResponse.fromEntity(user));
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
                
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }
        
        var jwtToken = jwtUtil.generateToken(user);
        
        return new AuthResponse(jwtToken, UserResponse.fromEntity(user));
    }

    public void resendOtp(String email) {
        User user = repository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        if (user.isVerified()) {
            throw new RuntimeException("User is already verified");
        }
        
        user.setOtp(generateOtp());
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        repository.save(user);
        
        emailService.sendOtpEmail(user.getEmail(), user.getOtp());
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        User user = repository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        if (user.isVerified()) {
            throw new RuntimeException("User is already verified");
        }
        
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
        
        if (user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        repository.save(user);
        
        var jwtToken = jwtUtil.generateToken(user);
        return new AuthResponse(jwtToken, UserResponse.fromEntity(user));
    }
}
