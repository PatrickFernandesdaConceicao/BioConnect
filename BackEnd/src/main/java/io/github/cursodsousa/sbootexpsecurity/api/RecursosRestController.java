package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.api.dto.RecursosDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Recursos;
import io.github.cursodsousa.sbootexpsecurity.domain.service.EventoService;
import io.github.cursodsousa.sbootexpsecurity.domain.service.RecursosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recursos")
public class RecursosRestController {

    @Autowired
    private RecursosService recursosService;

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public ResponseEntity<List<RecursosDTO>> listarRecursos() {
        List<Recursos> recursos = recursosService.listarRecursos();
        List<RecursosDTO> recursosDTOs = recursos.stream()
                .map(RecursosDTO::fromRecursos)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recursosDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursosDTO> detalharRecurso(@PathVariable Long id) {
        Recursos recurso = recursosService.buscarIdRecursos(id);
        if (recurso == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(RecursosDTO.fromRecursos(recurso));
    }

    @PostMapping
    public ResponseEntity<?> criarRecursos(@Valid @RequestBody RecursosDTO recursosDTO) {
        // Verificar se o evento existe
        Evento evento = eventoService.buscarIdEvento(recursosDTO.getEventoId());
        if (evento == null) {
            return ResponseEntity.badRequest().body("Evento não encontrado");
        }

        Recursos recursos = recursosDTO.toRecursos(evento);
        Recursos recursosCriado = recursosService.criarRecursos(recursos);
        return ResponseEntity.status(HttpStatus.CREATED).body(RecursosDTO.fromRecursos(recursosCriado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarRecursos(@PathVariable Long id, @Valid @RequestBody RecursosDTO recursosDTO) {
        // Verificar se o recurso existe
        if (recursosService.buscarIdRecursos(id) == null) {
            return ResponseEntity.notFound().build();
        }

        // Verificar se o evento existe
        Evento evento = eventoService.buscarIdEvento(recursosDTO.getEventoId());
        if (evento == null) {
            return ResponseEntity.badRequest().body("Evento não encontrado");
        }

        Recursos recursos = recursosDTO.toRecursos(evento);
        recursos.setId(id);
        Recursos recursosAtualizado = recursosService.criarRecursos(recursos);
        return ResponseEntity.ok(RecursosDTO.fromRecursos(recursosAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRecursos(@PathVariable Long id) {
        recursosService.deletarRecursos(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<RecursosDTO>> buscarRecursosPorEvento(@PathVariable Long eventoId) {
        List<Recursos> recursos = recursosService.buscarPorEventoId(eventoId);
        List<RecursosDTO> recursosDTOs = recursos.stream()
                .map(RecursosDTO::fromRecursos)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recursosDTOs);
    }
}