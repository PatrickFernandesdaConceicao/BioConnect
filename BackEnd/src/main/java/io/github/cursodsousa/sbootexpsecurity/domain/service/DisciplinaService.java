package io.github.cursodsousa.sbootexpsecurity.domain.service;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.CursoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public List<Disciplina> listaDisciplina(){
        return disciplinaRepository.findAll();}

    public Disciplina buscarIdDisciplina(Long id){
        return disciplinaRepository.findById(id).orElse(null);}

    public Disciplina criarDisciplina(Disciplina disciplina) {
        if (disciplina.getCurso() == null || disciplina.getCurso().getId() == null) {
            throw new IllegalArgumentException("Curso é obrigatório");
        }

        Curso curso = cursoRepository.findById(disciplina.getCurso().getId())
                .orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));

        disciplina.setCurso(curso);
        return disciplinaRepository.save(disciplina);
    }

    public void deletarDisciplina(Long id){
        disciplinaRepository.deleteById(id);}
}
