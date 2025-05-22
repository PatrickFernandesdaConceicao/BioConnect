package io.github.cursodsousa.sbootexpsecurity.api;


import io.github.cursodsousa.sbootexpsecurity.api.dto.DisciplinaDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import io.github.cursodsousa.sbootexpsecurity.domain.service.DisciplinaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/disciplina")
public class DisciplinaRestController {

    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    public ResponseEntity<List<DisciplinaDTO>> listarDisciplina(){
        List<Disciplina> disciplinas = disciplinaService.listaDisciplina();
            List<DisciplinaDTO> disciplinaDTOS = disciplinas.stream()
                    .map(DisciplinaDTO :: fromDisciplina)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(disciplinaDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaDTO> detalharDisciplina(@PathVariable Long id){
        Disciplina disciplina = disciplinaService.buscarIdMonitoria(id);
        if(disciplina == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(DisciplinaDTO.fromDisciplina(disciplina));
    }

    @PostMapping
    public ResponseEntity<DisciplinaDTO> criarDisciplina(@Valid @RequestBody DisciplinaDTO disciplinaDTO){
        Disciplina disciplina = disciplinaDTO.toDisciplina();
        Disciplina disciplinaCriada = disciplinaService.criarDisciplina(disciplina);
        return ResponseEntity.status(HttpStatus.CREATED).body(DisciplinaDTO.fromDisciplina(disciplinaCriada));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DisciplinaDTO> atualizarDisciplina(@PathVariable Long id, @Valid @RequestBody DisciplinaDTO disciplinaDTO){
        Disciplina disciplina = disciplinaDTO.toDisciplina();
        disciplina.setId(id);
        Disciplina disciplinaAtualizada = disciplinaService.criarDisciplina(disciplina);
        return ResponseEntity.ok(DisciplinaDTO.fromDisciplina(disciplinaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDisciplina(@PathVariable Long id){
        disciplinaService.deletarDisciplina(id);
        return ResponseEntity.noContent().build();
    }
}
