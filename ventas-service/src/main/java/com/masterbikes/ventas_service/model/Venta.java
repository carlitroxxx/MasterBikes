package com.masterbikes.ventas_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ventas")
public class Venta {
    @Id
    private String id;
    private Cliente cliente;
    private List<ProductoVenta> productos;
    private Double subtotal;
    private Double iva;
    private Double total;
    private LocalDateTime fecha;
    private String estado; // "PENDIENTE", "COMPLETADA", "CANCELADA"
}
