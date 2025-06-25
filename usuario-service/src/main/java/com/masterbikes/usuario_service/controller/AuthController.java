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


    // En tu AuthController.java
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    // AuthController.java (fragmento actualizado)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (request.getRut() == null || request.getRut().trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("RUT_REQUIRED", "El RUT es obligatorio")); // 2 args
            }

            authService.registerClient(request);
            AuthResponse response = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String errorCode = e.getMessage();
            if ("EMAIL_EXISTS".equals(errorCode)) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse("EMAIL_EXISTS", "El correo ya está en uso")); // 2 args
            } else if ("RUT_EXISTS".equals(errorCode)) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse("RUT_EXISTS", "El RUT ya está registrado")); // 2 args
            } else {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ErrorResponse("UNKNOWN_ERROR", "Error al registrar")); // 2 args
            }
        }
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
            // Asignar un código de error genérico para este caso
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("PASSWORD_ERROR", e.getMessage())); // <- Ahora con código
        }
    }

    // Clase adicional para la respuesta de error
    // Dentro de AuthController.java
    @Data
    @AllArgsConstructor
    class ErrorResponse {
        private String code;  // <- Añade este campo
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
