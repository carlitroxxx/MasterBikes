package com.masterbikes.inventario_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "bicicletas_arriendo")
@Data
public class BicicletaArriendo {
    @Id
    private String id;
    private String nombre;
    private String descripcion;
    private int tarifaDiaria;
    private boolean disponible;
    private String modelo;
}