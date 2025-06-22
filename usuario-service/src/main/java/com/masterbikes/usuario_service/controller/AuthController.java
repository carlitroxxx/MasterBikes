package com.masterbikes.usuario_service.controller;

import com.masterbikes.usuario_service.dto.AuthRequest;
import com.masterbikes.usuario_service.dto.AuthResponse;
import com.masterbikes.usuario_service.dto.EmployeeRegisterRequest;
import com.masterbikes.usuario_service.dto.RegisterRequest;
import com.masterbikes.usuario_service.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        authService.registerClient(request);
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/employee")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<AuthResponse> registerEmployee(@RequestBody EmployeeRegisterRequest request) {
        authService.registerEmployee(request);
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }
}
