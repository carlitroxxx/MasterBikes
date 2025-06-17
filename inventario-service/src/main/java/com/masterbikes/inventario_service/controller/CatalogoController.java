package com.masterbikes.inventario_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.masterbikes.inventario_service.model.BicicletaArriendo;
import com.masterbikes.inventario_service.model.ProductoVenta;
import com.masterbikes.inventario_service.service.CatalogoService;
import com.masterbikes.inventario_service.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class CatalogoController {

    private final CatalogoService catalogoService;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper;

    @Autowired
    public CatalogoController(CatalogoService catalogoService,
                              CloudinaryService cloudinaryService,
                              ObjectMapper objectMapper) {
        this.catalogoService = catalogoService;
        this.cloudinaryService = cloudinaryService;
        this.objectMapper = objectMapper;
    }

    // ======================
    // Endpoints para Productos de Venta
    // ======================

    @GetMapping("/venta")
    public List<ProductoVenta> getProductosVenta() {
        return catalogoService.getProductosVenta();
    }

    @PostMapping("/venta")
    public ResponseEntity<?> crearProductoVenta(@RequestBody ProductoVenta producto) {
        // Validaciones básicas
        if (producto.getId() == null || producto.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("El ID es requerido");
        }

        if (catalogoService.existeProductoConId(producto.getId())) {
            return ResponseEntity.badRequest().body("Ya existe un producto con este ID");
        }

        if (producto.getTipo() == null || producto.getNombre() == null) {
            return ResponseEntity.badRequest().body("Tipo y nombre son obligatorios");
        }

        if (producto.getPrecio() <= 0 || producto.getStock() < 0) {
            return ResponseEntity.badRequest().body("Precio y stock deben ser positivos");
        }

        ProductoVenta guardado = catalogoService.guardarProductoVenta(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PostMapping(value = "/venta/con-imagenes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProductoConImagenes(
            @RequestPart("producto") String productoStr,
            @RequestPart(value = "imagenes", required = false) List<MultipartFile> imagenes) {
        try {
            ProductoVenta producto = objectMapper.readValue(productoStr, ProductoVenta.class);

            // Validaciones básicas
            if (producto.getId() == null || producto.getId().isEmpty()) {
                return ResponseEntity.badRequest().body("El ID es requerido");
            }
            if (catalogoService.existeProductoConId(producto.getId())) {
                return ResponseEntity.badRequest().body("Ya existe un producto con este ID");
            }
            if (producto.getTipo() == null || producto.getNombre() == null) {
                return ResponseEntity.badRequest().body("Tipo y nombre son obligatorios");
            }
            if (producto.getPrecio() <= 0 || producto.getStock() < 0) {
                return ResponseEntity.badRequest().body("Precio y stock deben ser positivos");
            }

            ProductoVenta guardado = catalogoService.guardarProductoVenta(producto);

            if (imagenes != null && !imagenes.isEmpty()) {
                List<String> urls = cloudinaryService.uploadMultipleImages(imagenes);
                guardado = catalogoService.agregarImagenesAProducto(guardado.getId(), urls);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/venta/{tipo}")
    public List<ProductoVenta> getProductosVentaPorTipo(@PathVariable String tipo) {
        return catalogoService.getProductosPorTipo(tipo);
    }

    // ======================
    // Endpoints para Bicicletas de Arriendo
    // ======================

    @GetMapping("/arriendo")
    public List<BicicletaArriendo> getBicicletasArriendo() {
        return catalogoService.getBicicletasArriendo();
    }

    @PostMapping("/arriendo")
    public ResponseEntity<?> crearBicicletaArriendo(@RequestBody BicicletaArriendo bicicleta) {
        // Validaciones básicas
        if (bicicleta.getId() == null || bicicleta.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("El ID es requerido");
        }

        if (catalogoService.existeBicicletaConId(bicicleta.getId())) {
            return ResponseEntity.badRequest().body("Ya existe una bicicleta con este ID");
        }

        BicicletaArriendo guardada = catalogoService.guardarBicicletaArriendo(bicicleta);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // ======================
    // Endpoints para Gestión de Imágenes
    // ======================

    @PostMapping("/venta/{id}/imagenes")
    public ResponseEntity<?> agregarImagenesProducto(
            @PathVariable String id,
            @RequestParam("imagenes") List<MultipartFile> imagenes) {
        try {
            List<String> urls = cloudinaryService.uploadMultipleImages(imagenes);
            ProductoVenta producto = catalogoService.agregarImagenesAProducto(id, urls);
            return ResponseEntity.ok(producto);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error al subir imágenes: " + e.getMessage());
        }
    }

    @DeleteMapping("/venta/{id}/imagenes")
    public ResponseEntity<?> eliminarImagenProducto(
            @PathVariable String id,
            @RequestParam String urlImagen) {
        try {
            cloudinaryService.deleteImage(urlImagen);
            catalogoService.eliminarImagenDeProducto(id, urlImagen);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error al eliminar imagen: " + e.getMessage());
        }
    }

    // ======================
    // Endpoint de Prueba
    // ======================

    @PostMapping("/test-upload")
    public ResponseEntity<String> testUpload(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok("Imagen subida correctamente. URL: " + url);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}