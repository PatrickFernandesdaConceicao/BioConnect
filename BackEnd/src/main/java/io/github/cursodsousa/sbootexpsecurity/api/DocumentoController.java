package io.github.cursodsousa.sbootexpsecurity.api;

import io.github.cursodsousa.sbootexpsecurity.api.dto.DocumentoDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.service.DocumentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentoDTO> uploadDocumento(@RequestParam("arquivo") MultipartFile arquivo) {
        DocumentoDTO documentoDTO = documentoService.salvarDocumento(arquivo);
        return ResponseEntity.ok(documentoDTO);
    }

    @GetMapping
    public ResponseEntity<List<DocumentoDTO>> listarTodos() {
        return ResponseEntity.ok(documentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        documentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DocumentoDTO> atualizarParcial(@PathVariable Long id, @RequestBody DocumentoDTO dto) {
        DocumentoDTO atualizado = documentoService.atualizarParcial(id, dto);
        return ResponseEntity.ok(atualizado);
    }
}
