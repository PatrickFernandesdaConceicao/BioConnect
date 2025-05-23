package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.api.dto.RegistrarUsuarioDTO;
import io.github.cursodsousa.sbootexpsecurity.api.dto.UsuarioResponseDTO;

import io.github.cursodsousa.sbootexpsecurity.domain.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponseDTO> registrar(@RequestBody @Valid RegistrarUsuarioDTO dto) {
        UsuarioResponseDTO usuarioRegistrado = usuarioService.registrar(dto);
        return ResponseEntity.ok(usuarioRegistrado);
    }
}