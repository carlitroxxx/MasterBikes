package com.masterbikes.carrito_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AgregarProductoRequest {
    @NotBlank
    private String productoId;

    @NotNull
    @Min(1)
    private Integer cantidad;
}