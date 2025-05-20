package io.github.cursodsousa.sbootexpsecurity.domain.repository;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Recursos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecursosRepository extends JpaRepository<Recursos, Long> {
    List<Recursos> findByEventoId(Long eventoId);
}