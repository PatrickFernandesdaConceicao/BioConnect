package io.github.cursodsousa.sbootexpsecurity.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/permi")
public class DocenteController {

    @GetMapping("/professor")
    @PreAuthorize("hasAnyRole('PROFESSOR','COORDENADOR','ADMIN')")
    public ResponseEntity<String> professor(){
        return ResponseEntity.ok("Rota Professor");
    }

    @GetMapping("/coordenador")
    @PreAuthorize("hasAnyRole('COORDENADOR','ADMIN')")
    public ResponseEntity<String> coordenador(){
        return ResponseEntity.ok("Rota coordenador");
    }
}
