package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do curso é obrigatório")
    @Size(max = 100, message = "O nome do curso deve ter no máximo 100 caracteres")
    private String nome;

    @OneToMany(mappedBy = "curso",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Disciplina> disciplinas = new ArrayList<>();

    @OneToMany(mappedBy = "curso")
    private List<Evento> eventos = new ArrayList<>();

    // Métodos auxiliares para gerenciar o relacionamento
    public void addDisciplina(Disciplina disciplina) {
        disciplinas.add(disciplina);
        disciplina.setCurso(this);
    }

    public void removeDisciplina(Disciplina disciplina) {
        disciplinas.remove(disciplina);
        disciplina.setCurso(null);
    }
}