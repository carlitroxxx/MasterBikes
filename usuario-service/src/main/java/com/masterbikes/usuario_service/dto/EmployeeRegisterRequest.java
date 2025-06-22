package com.masterbikes.usuario_service.dto;


import com.masterbikes.usuario_service.model.Role;
import lombok.Data;

@Data
public class EmployeeRegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private Role role;
}