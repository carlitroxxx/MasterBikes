package com.masterbikes.ventas_service.service;

import com.masterbikes.ventas_service.dto.VentaRequest;
import com.masterbikes.ventas_service.dto.VentaResponse;
import com.masterbikes.ventas_service.model.ProductoVenta;
import com.masterbikes.ventas_service.model.Venta;
import com.masterbikes.ventas_service.repository.VentaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class VentaService {
    private final VentaRepository ventaRepository;

    public VentaResponse registrarVenta(VentaRequest ventaRequest) {
        // Calcular totales
        double subtotal = ventaRequest.getProductos().stream()
                .mapToDouble(ProductoVenta::getPrecioTotal)
                .sum();
        double iva = subtotal * 0.16; // IVA del 16%
        double total = subtotal + iva;

        // Crear venta
        Venta venta = Venta.builder()
                .cliente(ventaRequest.getCliente())
                .productos(ventaRequest.getProductos())
                .subtotal(subtotal)
                .iva(iva)
                .total(total)
                .fecha(LocalDateTime.now())
                .estado("COMPLETADA")
                .build();

        // Guardar en MongoDB
        Venta ventaGuardada = ventaRepository.save(venta);

        return new VentaResponse(
                ventaGuardada.getId(),
                "Venta registrada exitosamente",
                ventaGuardada
        );
    }
}