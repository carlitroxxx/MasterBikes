package com.masterbikes.ventas_service.controller;

import com.masterbikes.ventas_service.dto.VentaRequest;
import com.masterbikes.ventas_service.dto.VentaResponse;
import com.masterbikes.ventas_service.model.Venta;
import com.masterbikes.ventas_service.service.VentaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
@AllArgsConstructor
public class VentaController {
    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<?> registrarVenta(@Valid @RequestBody VentaRequest ventaRequest) {
        try {
            VentaResponse response = ventaService.registrarVenta(ventaRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Esto aparecerá en los logs del servidor
            return new ResponseEntity<>("Error al procesar la venta: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<VentaResponse>> obtenerTodasLasVentas() {
        List<Venta> ventas = ventaService.obtenerTodasLasVentas();
        List<VentaResponse> responses = ventas.stream()
                .map(venta -> new VentaResponse(
                        venta.getId(),
                        "Venta recuperada exitosamente",
                        venta))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}