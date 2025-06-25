package com.masterbikes.usuario_service.repository;

import com.masterbikes.usuario_service.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRut(String rut);
    Optional<User> findByRut(String rut);
}