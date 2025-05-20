package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Participante;
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
            @RequestBody List<Participante> participantes
    ) {
        Evento evento = participanteService.adicionarParticipantes(eventoId, participantes);
        return ResponseEntity.ok(evento);
    }

    @GetMapping
    public ResponseEntity<List<Participante>> listarParticipantes(@PathVariable Long eventoId) {
        List<Participante> participantes = participanteService.listarPorEvento(eventoId);
        return ResponseEntity.ok(participantes);
    }
}