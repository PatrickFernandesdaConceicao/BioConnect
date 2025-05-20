package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.api.dto.EventoRequestDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Participante;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Recursos;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.EventoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;


    public List<Evento> listarEventos(){
        return eventoRepository.findAll();}

    public Evento buscarIdEvento(Long id){
        return eventoRepository.findById(id).orElse(null);}

    public Evento criarEventoComParticipantes(EventoRequestDTO dto) {
        Evento evento = new Evento();
        evento.setTitulo(dto.titulo);
        evento.setCurso(dto.curso);
        evento.setDataInicio(LocalDate.parse(dto.dataInicio));
        evento.setDataTermino(LocalDate.parse(dto.dataTermino));
        evento.setLocal(dto.local);
        evento.setJustificativa(dto.justificativa);
        evento.setVlTotalSolicitado(dto.vlTotalSolicitado);
        evento.setVlTotalAprovado(dto.vlTotalAprovado);

        if (dto.participantes != null) {
            List<Participante> participantes = dto.participantes.stream().map(p -> {
                Participante participante = new Participante();
                participante.setNome(p.nome);
                participante.setEmail(p.email);
                participante.setEvento(evento); // Associação bidirecional
                return participante;
            }).collect(Collectors.toList());

            evento.setParticipantes(participantes); // Agora você pode setar a lista de participantes
        }

        return eventoRepository.save(evento); // Persiste o evento e seus participantes
    }

    public void deletarEvento(Long id){
        eventoRepository.deleteById(id);}

    private void calcularTotaisEvento(Evento evento) {
        Float totalSolicitado = evento.getRecurso().stream()
                .map(Recursos::getTotalSolicitado)
                .reduce(0f, Float::sum);
        evento.setVlTotalSolicitado(totalSolicitado);
    }

}