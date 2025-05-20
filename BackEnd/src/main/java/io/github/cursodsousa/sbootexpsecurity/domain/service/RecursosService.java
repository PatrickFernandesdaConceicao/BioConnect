package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Recursos;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.RecursosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecursosService {

    @Autowired
    private RecursosRepository recursosRepository;

    public List<Recursos> listarRecursos(){
        return recursosRepository.findAll();}

    public Recursos buscarIdRecursos(Long id){
        return recursosRepository.findById(id).orElse(null);}

    public Recursos criarRecursos(Recursos recursos) {
        if (recursos.getTotalSolicitado() == null && recursos.getQtd() != null && recursos.getValorUnit() != null) {
            recursos.setTotalSolicitado(recursos.getQtd() * recursos.getValorUnit());
        }
        return recursosRepository.save(recursos);
    }

    public void deletarRecursos(Long id){
        recursosRepository.deleteById(id);}

    public List<Recursos> buscarPorEventoId(Long eventoId) {
        return recursosRepository.findByEventoId(eventoId);}

}