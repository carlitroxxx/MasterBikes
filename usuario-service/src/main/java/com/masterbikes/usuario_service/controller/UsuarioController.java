package com.masterbikes.usuario_service.controller;

import com.masterbikes.usuario_service.model.Usuario;
import com.masterbikes.usuario_service.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repo;

    @PostMapping
    public Usuario crear(@RequestBody Usuario u) {
        System.out.println("Usuario creado: " + u.getNombre());
        return repo.save(u);
    }

    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }
}
