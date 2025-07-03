package com.masterbikes.ventas_service.dto;

import com.masterbikes.ventas_service.model.Venta;
import lombok.Data;

@Data
public class VentaResponse {
    private String id;
    private String mensaje;
    private Venta venta;

    public VentaResponse(String id, String mensaje, Venta venta) {
        this.id = id;
        this.mensaje = mensaje;
        this.venta = venta;
    }
}