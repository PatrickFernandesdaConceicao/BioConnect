package io.github.cursodsousa.sbootexpsecurity.config;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Grupo;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.GrupoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final GrupoRepository grupoRepository;

    @PostConstruct
    public void init() {
        if (grupoRepository.findByNome("USUARIO").isEmpty()) {
            Grupo grupoUsuario = new Grupo();
            grupoUsuario.setNome("USUARIO");
            grupoRepository.save(grupoUsuario);
        }

        if (grupoRepository.findByNome("ADMIN").isEmpty()) {
            Grupo grupoAdmin = new Grupo();
            grupoAdmin.setNome("ADMIN");
            grupoRepository.save(grupoAdmin);
        }
    }
}