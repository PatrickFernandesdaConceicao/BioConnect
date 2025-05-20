package io.github.cursodsousa.sbootexpsecurity.domain.service;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Monitoria;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.MonitoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MonitoriaService {

    @Autowired
    private MonitoriaRepository monitoriaRepository;

    public List<Monitoria> listarMonitoria(){
        return monitoriaRepository.findAll();}

    public Monitoria buscarIdMonitoria(Long id){
        return monitoriaRepository.findById(id).orElse(null);}

    public Monitoria criarMonitoria(Monitoria monitoria){
        return monitoriaRepository.save(monitoria);}

    public void deletarMonitoria(Long id){
        monitoriaRepository.deleteById(id);}

    public List<Monitoria> buscarPorDisciplinaId(Long disciplinaId) {
        return monitoriaRepository.findByDisciplinaId(disciplinaId);}
}
