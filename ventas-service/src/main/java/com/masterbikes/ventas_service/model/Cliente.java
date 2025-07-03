package com.masterbikes.ventas_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    private String rut;
    private String nombre;
    private String telefono;
    private String email;
    private String direccion;
}