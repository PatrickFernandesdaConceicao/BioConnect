package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.api.dto.MonitoriaDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Monitoria;
import io.github.cursodsousa.sbootexpsecurity.domain.service.MonitoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/monitoria")
public class MonitoriaRestController {
    @Autowired
    private MonitoriaService monitoriaService;

    @GetMapping
    public ResponseEntity<List<MonitoriaDTO>> listarMonitoria(){
        List<Monitoria> monitorias = monitoriaService.listarMonitoria();
            List<MonitoriaDTO> monitoriaDTOs = monitorias.stream()
                    .map(MonitoriaDTO::fromMonitoria)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(monitoriaDTOs);
        }

    @GetMapping("/{id}")
    public ResponseEntity<MonitoriaDTO> detalharMonitoria(@PathVariable Long id){
        Monitoria monitoria = monitoriaService.buscarIdMonitoria(id);
        if(monitoria == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(MonitoriaDTO.fromMonitoria(monitoria));
    }

    @PostMapping
    public ResponseEntity<MonitoriaDTO> criarMonitoria(@Valid @RequestBody MonitoriaDTO monitoriaDTO){
        Monitoria monitoria = monitoriaDTO.toMonitoria();
        Monitoria monitoriaCriada = monitoriaService.criarMonitoria(monitoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(MonitoriaDTO.fromMonitoria(monitoriaCriada));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MonitoriaDTO> atualizarMonitoria(@PathVariable Long id, @Valid @RequestBody MonitoriaDTO monitoriaDTO){
        Monitoria monitoria = monitoriaDTO.toMonitoria();
        monitoria.setId(id);
        Monitoria monitoriaAtualizada = monitoriaService.criarMonitoria(monitoria);
        return ResponseEntity.ok(MonitoriaDTO.fromMonitoria(monitoriaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMonitoria(@PathVariable Long id){
        monitoriaService.deletarMonitoria(id);
        return ResponseEntity.noContent().build();
    }

}

