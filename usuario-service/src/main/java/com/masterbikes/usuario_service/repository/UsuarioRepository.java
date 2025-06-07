package com.masterbikes.usuario_service.repository;

import com.masterbikes.usuario_service.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
}
