package io.github.cursodsousa.sbootexpsecurity.domain.repository;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Monitoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonitoriaRepository extends JpaRepository<Monitoria, Long> {
    List<Monitoria> findByDisciplinaId(Long disciplinaId);
}
