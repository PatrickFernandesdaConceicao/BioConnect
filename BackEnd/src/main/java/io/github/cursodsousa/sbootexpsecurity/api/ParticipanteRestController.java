package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.ParticipanteEvento;
import io.github.cursodsousa.sbootexpsecurity.domain.service.ParticipanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evento/{eventoId}/participantes")
public class ParticipanteRestController {

    @Autowired
    private ParticipanteService participanteService;

    @PostMapping
    public ResponseEntity<Evento> adicionarParticipantes(
            @PathVariable Long eventoId,
            @RequestBody List<ParticipanteEvento> participanteEventos
    ) {
        Evento evento = participanteService.adicionarParticipantes(eventoId, participanteEventos);
        return ResponseEntity.ok(evento);
    }

    @GetMapping
    public ResponseEntity<List<ParticipanteEvento>> listarParticipantes(@PathVariable Long eventoId) {
        List<ParticipanteEvento> participanteEventos = participanteService.listarPorEvento(eventoId);
        return ResponseEntity.ok(participanteEventos);
    }
}