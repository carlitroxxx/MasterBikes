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

    @Autowired
    public CatalogoController(CatalogoService catalogoService, CloudinaryService cloudinaryService) {
        this.catalogoService = catalogoService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/venta")
    public List<ProductoVenta> getProductosVenta() {
        return catalogoService.getProductosVenta();
    }

    @PostMapping(value = "/venta", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProductoConImagenes(
            @RequestPart("producto") String productoStr,
            @RequestPart(value = "imagenes", required = false) List<MultipartFile> imagenes) {

        try {
            ProductoVenta producto = new ObjectMapper().readValue(productoStr, ProductoVenta.class);

            // Aquí irían las mismas validaciones que en la versión simple
            if (producto.getTipo() == null || producto.getNombre() == null) {
                return ResponseEntity.badRequest().body("Tipo y nombre son obligatorios");
            }

            if (!"bicicleta".equalsIgnoreCase(producto.getTipo()) &&
                    !"componente".equalsIgnoreCase(producto.getTipo())) {
                return ResponseEntity.badRequest().body("Tipo debe ser 'bicicleta' o 'componente'");
            }

            // Validar precio y stock
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

    @GetMapping("/arriendo")
    public List<BicicletaArriendo> getBicicletasArriendo() {
        return catalogoService.getBicicletasArriendo();
    }

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