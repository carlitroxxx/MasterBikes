package com.masterbikes.carrito_service.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class AgregarProductoRequest {
    @NotBlank
    private String productoId;

    @NotNull
    @Min(1)
    private Integer cantidad;
}
