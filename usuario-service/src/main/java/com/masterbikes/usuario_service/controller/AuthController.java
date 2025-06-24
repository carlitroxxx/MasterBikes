package com.masterbikes.usuario_service.controller;

import com.masterbikes.usuario_service.dto.*;
import com.masterbikes.usuario_service.model.User;
import com.masterbikes.usuario_service.repository.UserRepository;
import com.masterbikes.usuario_service.service.AuthService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
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

    // Agrega esto a AuthController.java

    @PutMapping("/update-profile")
    @PreAuthorize("hasAnyRole('CLIENTE', 'VENDEDOR', 'TECNICO', 'INVENTARIO', 'SUPERVISOR')")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User updatedUser = authService.updateProfile(email, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('CLIENTE', 'VENDEDOR', 'TECNICO', 'INVENTARIO', 'SUPERVISOR')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            authService.changePassword(email, request);
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Clase adicional para la respuesta de error
    @Data
    @AllArgsConstructor
    class ErrorResponse {
        private String message;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENTE', 'VENDEDOR', 'TECNICO', 'INVENTARIO', 'SUPERVISOR')")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(user);
    }


}
