package com.masterbikes.ventas_service.controller;

import com.masterbikes.ventas_service.dto.VentaRequest;
import com.masterbikes.ventas_service.dto.VentaResponse;
import com.masterbikes.ventas_service.service.VentaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ventas")
@AllArgsConstructor
public class VentaController {
    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<VentaResponse> registrarVenta(@Valid @RequestBody VentaRequest ventaRequest) {
        VentaResponse response = ventaService.registrarVenta(ventaRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}