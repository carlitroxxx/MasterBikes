package com.masterbikes.inventario_service.controller;

import com.masterbikes.inventario_service.model.BicicletaArriendo;
import com.masterbikes.inventario_service.model.ProductoVenta;
import com.masterbikes.inventario_service.service.CatalogoService;
import com.masterbikes.inventario_service.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
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