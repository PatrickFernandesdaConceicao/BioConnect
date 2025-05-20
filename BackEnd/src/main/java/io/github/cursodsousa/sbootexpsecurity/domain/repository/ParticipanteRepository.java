package io.github.cursodsousa.sbootexpsecurity.domain.repository;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Participante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    List<Participante> findByEventoId(Long eventoId);
}
