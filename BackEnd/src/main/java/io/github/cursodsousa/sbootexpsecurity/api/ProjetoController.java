package io.github.cursodsousa.sbootexpsecurity.api;


import io.github.cursodsousa.sbootexpsecurity.api.dto.CriarProjetoRequest;
import io.github.cursodsousa.sbootexpsecurity.api.dto.ProjetoDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.service.ProjetoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projetos")
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @PostMapping
    public ResponseEntity<ProjetoDTO> criarProjeto(@Valid @RequestBody CriarProjetoRequest request) {
        ProjetoDTO projetoDTO = projetoService.criarProjeto(request);
        return ResponseEntity.ok(projetoDTO);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProjetoDTO> atualizarProjeto(
            @PathVariable Long id,
            @RequestBody ProjetoDTO request) {
        ProjetoDTO atualizado = projetoService.atualizarProjeto(id, request);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping
    public ResponseEntity<List<ProjetoDTO>> listarTodosProjetos() {
        List<ProjetoDTO> projetos = projetoService.listarTodos();
        return ResponseEntity.ok(projetos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProjeto(@PathVariable Long id) {
        projetoService.deletarProjeto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetoDTO> buscarProjetoPorId(@PathVariable Long id) {
        ProjetoDTO projeto = projetoService.buscarProjetoPorId(id);
        return ResponseEntity.ok(projeto);
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<ProjetoDTO> aprovarProjeto(@PathVariable Long id) {
        ProjetoDTO projetoDTO = projetoService.aprovarProjeto(id);
        return ResponseEntity.ok(projetoDTO);
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<ProjetoDTO> rejeitarProjeto(@PathVariable Long id) {
        ProjetoDTO projetoDTO = projetoService.rejeitarProjeto(id);
        return ResponseEntity.ok(projetoDTO);
    }
}