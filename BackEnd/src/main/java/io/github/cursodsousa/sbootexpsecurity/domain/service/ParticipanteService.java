package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.ParticipanteEvento;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.EventoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipanteService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ParticipanteRepository participanteRepository;

    public Evento adicionarParticipantes(Long eventoId, List<ParticipanteEvento> participanteEventos) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado com ID: " + eventoId));

        for (ParticipanteEvento p : participanteEventos) {
            p.setEvento(evento);
        }

        participanteRepository.saveAll(participanteEventos);

        return evento;
    }

    public List<ParticipanteEvento> listarPorEvento(Long eventoId) {
        return participanteRepository.findByEventoId(eventoId);
    }
}
