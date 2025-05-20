package io.github.cursodsousa.sbootexpsecurity.api;


import io.github.cursodsousa.sbootexpsecurity.api.dto.CursoDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/curso")
public class CursoRestController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<CursoDTO>> listarCurso(){
        List<Curso> cursos = cursoService.listarCurso();
        List<CursoDTO> cursoDTOS = cursos.stream()
                .map(CursoDTO :: fromCurso)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cursoDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> detalharCurso(@PathVariable Long id){
        Curso curso = cursoService.buscarIdCurso(id);
        if(curso == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(CursoDTO.fromCurso(curso));
    }

    @PostMapping
    public ResponseEntity<CursoDTO> criarCurso(@Valid @RequestBody CursoDTO cursoDTO){
        Curso curso = cursoDTO.toCurso();
        Curso cursoCriado = cursoService.criarCurso(curso);
        return ResponseEntity.status(HttpStatus.CREATED).body(CursoDTO.fromCurso(cursoCriado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> atualizarCurso(@PathVariable Long id, @Valid @RequestBody CursoDTO cursoDTO){
        Curso curso = cursoDTO.toCurso();
        curso.setId(id);
        Curso curoAtualizado = cursoService.criarCurso(curso);
        return ResponseEntity.ok(CursoDTO.fromCurso(curoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id){
        cursoService.deletarCurso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CursoDTO>> buscarPorNome(@RequestParam String termo) {
        List<Curso> cursos = cursoService.buscarPorNomeContendo(termo);
        // conversão para DTO
        return ResponseEntity.ok(cursos.stream().map(CursoDTO::fromCurso).toList());
    }

   /* @GetMapping("/coordenador/{coordenadorId}")
    public ResponseEntity<List<CursoDTO>> listarPorCoordenador(@PathVariable Long coordenadorId) {
        List<Curso> cursos = cursoService.buscarPorCoordenadorId(coordenadorId);
        return ResponseEntity.ok(cursos.stream().map(CursoDTO::fromCurso).toList());
    }*/
}
