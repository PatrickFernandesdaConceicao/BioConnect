package io.github.cursodsousa.sbootexpsecurity.domain.service;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public List<Disciplina> listaDisciplina(){
        return disciplinaRepository.findAll();}

    public Disciplina buscarIdMonitoria(Long id){
        return disciplinaRepository.findById(id).orElse(null);}

    public Disciplina criarDisciplina(Disciplina disciplina){
        return disciplinaRepository.save(disciplina);}

    public void deletarDisciplina(Long id){
        disciplinaRepository.deleteById(id);}
}
