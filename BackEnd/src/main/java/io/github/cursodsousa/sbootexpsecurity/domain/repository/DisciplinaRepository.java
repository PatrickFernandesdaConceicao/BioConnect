package io.github.cursodsousa.sbootexpsecurity.domain.repository;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    // Agora funciona pois temos a propriedade curso na entidade Disciplina
    List<Disciplina> findByCursoId(Long cursoId);

    // Método alternativo usando o objeto Curso
    List<Disciplina> findByCurso(Curso curso);
}
