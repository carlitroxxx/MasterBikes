package com.masterbikes.ventas_service.dto;

import com.masterbikes.ventas_service.model.Cliente;
import com.masterbikes.ventas_service.model.ProductoVenta;
import lombok.Data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class VentaRequest {
    @NotNull(message = "El cliente es obligatorio")
    @Valid
    private Cliente cliente;

    @NotEmpty(message = "Debe haber al menos un producto")
    private List<ProductoVenta> productos;
}