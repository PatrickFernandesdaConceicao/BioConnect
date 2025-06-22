package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.CursoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DisciplinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogoService {
    @Autowired
    private DisciplinaRepository disciplinaRepository;
    @Autowired
    private CursoRepository cursoRepository;

    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAllByOrderByNomeAsc();
    }

    public List<Curso> listarCursos() {
        return cursoRepository.findAllByOrderByNomeAsc();
    }

}