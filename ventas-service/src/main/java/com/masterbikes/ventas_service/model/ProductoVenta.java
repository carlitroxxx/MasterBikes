package com.masterbikes.ventas_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoVenta {
    private Long idProducto; // ID referenciado del microservicio de productos
    private String nombre;
    private Integer cantidad;
    private Double precioUnitario;
    private Double precioTotal;
}