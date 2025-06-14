package com.masterbikes.inventario_service.service;

import com.masterbikes.inventario_service.model.BicicletaArriendo;
import com.masterbikes.inventario_service.model.ProductoVenta;
import com.masterbikes.inventario_service.repository.BicicletaArriendoRepository;
import com.masterbikes.inventario_service.repository.ProductoVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CatalogoService {

    private final ProductoVentaRepository productoVentaRepo;
    private final BicicletaArriendoRepository bicicletaArriendoRepo;

    @Autowired
    public CatalogoService(ProductoVentaRepository productoVentaRepo,
                           BicicletaArriendoRepository bicicletaArriendoRepo) {
        this.productoVentaRepo = productoVentaRepo;
        this.bicicletaArriendoRepo = bicicletaArriendoRepo;
    }

    public List<ProductoVenta> getProductosVenta() {
        return productoVentaRepo.findAll();
    }

    public List<BicicletaArriendo> getBicicletasArriendo() {
        return bicicletaArriendoRepo.findAll();
    }

    public List<ProductoVenta> getProductosPorTipo(String tipo) {
        return productoVentaRepo.findByTipo(tipo);
    }

    public ProductoVenta agregarImagenesAProducto(String id, List<String> urls) {
        ProductoVenta producto = productoVentaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        producto.getImagenesUrls().addAll(urls);
        return productoVentaRepo.save(producto);
    }

    public void eliminarImagenDeProducto(String id, String urlImagen) {
        ProductoVenta producto = productoVentaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        producto.getImagenesUrls().remove(urlImagen);
        productoVentaRepo.save(producto);
    }
}