package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Participante;
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

    public Evento adicionarParticipantes(Long eventoId, List<Participante> participantes) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado com ID: " + eventoId));

        for (Participante p : participantes) {
            p.setEvento(evento);
        }

        participanteRepository.saveAll(participantes);

        return evento;
    }

    public List<Participante> listarPorEvento(Long eventoId) {
        return participanteRepository.findByEventoId(eventoId);
    }
}
