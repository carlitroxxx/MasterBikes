package com.masterbikes.ventas_service.repository;
import com.masterbikes.ventas_service.model.Venta;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends MongoRepository<Venta, String> {
}