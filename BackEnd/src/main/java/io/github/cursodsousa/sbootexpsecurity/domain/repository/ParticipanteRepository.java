package io.github.cursodsousa.sbootexpsecurity.domain.repository;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.ParticipanteEvento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipanteRepository extends JpaRepository<ParticipanteEvento, Long> {
    List<ParticipanteEvento> findByEventoId(Long eventoId);
}
