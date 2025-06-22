package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.api.dto.MonitoriaDTO;
import io.github.cursodsousa.sbootexpsecurity.api.dto.MonitoriaResponseDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.service.MonitoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoria")
public class MonitoriaRestController {

    @Autowired
    private MonitoriaService monitoriaService;

    @GetMapping
    public ResponseEntity<List<MonitoriaResponseDTO>> listarMonitoria() {
        List<MonitoriaResponseDTO> monitorias = monitoriaService.listarTodas();
        return ResponseEntity.ok(monitorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonitoriaResponseDTO> detalharMonitoria(@PathVariable Long id) {
        MonitoriaResponseDTO monitoria = monitoriaService.buscarPorId(id);
        return ResponseEntity.ok(monitoria);
    }

    @PostMapping
    public ResponseEntity<MonitoriaResponseDTO> criarMonitoria(@Valid @RequestBody MonitoriaDTO monitoriaDTO) {
        MonitoriaResponseDTO monitoriaCriada = monitoriaService.criarMonitoria(monitoriaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(monitoriaCriada);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MonitoriaResponseDTO> atualizarMonitoria(@PathVariable Long id, @Valid @RequestBody MonitoriaDTO monitoriaDTO) {
        MonitoriaResponseDTO monitoriaAtualizada = monitoriaService.atualizarMonitoria(id, monitoriaDTO);
        return ResponseEntity.ok(monitoriaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMonitoria(@PathVariable Long id) {
        monitoriaService.deletarMonitoria(id);
        return ResponseEntity.noContent().build();
    }
}
