package com.masterbikes.carrito_service.controller;


import com.masterbikes.carrito_service.dto.*;
import com.masterbikes.carrito_service.service.*;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@AllArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<CarritoDto> obtenerCarrito(@PathVariable String usuarioId) {
        return ResponseEntity.ok(carritoService.obtenerCarrito(usuarioId));
    }

    @PostMapping("/{usuarioId}/items")
    public ResponseEntity<CarritoDto> agregarProducto(
            @PathVariable String usuarioId,
            @RequestBody AgregarProductoRequest request) {
        return ResponseEntity.ok(carritoService.agregarProducto(usuarioId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCarrito(
            @PathVariable String id,
            @RequestParam String usuarioId) {
        carritoService.eliminarCarrito(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
