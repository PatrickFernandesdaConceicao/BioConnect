package io.github.cursodsousa.sbootexpsecurity.domain.repository;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Long> {
}