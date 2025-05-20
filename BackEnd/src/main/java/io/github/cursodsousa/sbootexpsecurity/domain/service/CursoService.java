package io.github.cursodsousa.sbootexpsecurity.domain.service;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.CursoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    public List<Curso> listarCurso(){
        return cursoRepository.findAll();}

    public Curso buscarIdCurso(Long id){
        return cursoRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Curso não encontrado com id: " + id));}

    public Curso criarCurso(Curso curso){
        return cursoRepository.save(curso);}

    public void deletarCurso(Long id){
        cursoRepository.deleteById(id);}

    public List<Curso> buscarPorNomeContendo(String termo) {
        return cursoRepository.findByNomeContainingIgnoreCase(termo);
    }

    //public List<Curso> buscarPorCoordenadorId(Long coordenadorId) {
    //    return cursoRepository.findByCoordenadorId(coordenadorId);
    //}

}
