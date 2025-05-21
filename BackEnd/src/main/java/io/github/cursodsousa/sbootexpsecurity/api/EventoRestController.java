package io.github.cursodsousa.sbootexpsecurity.api;



import io.github.cursodsousa.sbootexpsecurity.api.dto.EventoDTO;
import io.github.cursodsousa.sbootexpsecurity.api.dto.EventoRequestDTO;
import io.github.cursodsousa.sbootexpsecurity.api.dto.EventoResponseDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evento")
public class EventoRestController {
    @Autowired
    private EventoService eventoService;

    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarEventos() {
        List<Evento> eventos = eventoService.listarEventos();
        List<EventoDTO> eventoDTOs = eventos.stream()
                .map(EventoDTO::fromEvento)
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventoDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> detalharEvento(@PathVariable Long id) {
        Evento evento = eventoService.buscarIdEvento(id);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(EventoDTO.fromEvento(evento));
    }

    @PostMapping
    public ResponseEntity<EventoResponseDTO> criarEvento(@RequestBody EventoRequestDTO dto) {
        Evento evento = eventoService.criarEventoComParticipantes(dto);
        return ResponseEntity.ok(EventoResponseDTO.fromEvento(evento)); // Converta para DTO
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EventoDTO> atualizarEvento(@PathVariable Long id, @Valid @RequestBody EventoDTO eventoDTO) {
        // Converte o EventoDTO para Evento
        Evento evento = eventoDTO.toEvento();
        evento.setId(id);

        // Cria um EventoRequestDTO a partir do eventoDTO
        EventoRequestDTO eventoRequestDTO = new EventoRequestDTO();
        eventoRequestDTO.setTitulo(eventoDTO.getTitulo());
        eventoRequestDTO.setCurso(eventoDTO.getCurso());
        eventoRequestDTO.setDataInicio(eventoDTO.getDataInicio().toString());
        eventoRequestDTO.setDataTermino(eventoDTO.getDataTermino().toString());
        eventoRequestDTO.setLocal(eventoDTO.getLocal());
        eventoRequestDTO.setJustificativa(eventoDTO.getJustificativa());
        eventoRequestDTO.setVlTotalSolicitado(eventoDTO.getVlTotalSolicitado());
        eventoRequestDTO.setVlTotalAprovado(eventoDTO.getVlTotalAprovado());

        // Agora passa o eventoRequestDTO para o serviço
        Evento eventoAtualizado = eventoService.criarEventoComParticipantes(eventoRequestDTO);

        return ResponseEntity.ok(EventoDTO.fromEvento(eventoAtualizado));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEvento(@PathVariable Long id) {
        eventoService.deletarEvento(id);
        return ResponseEntity.noContent().build();
    }
}