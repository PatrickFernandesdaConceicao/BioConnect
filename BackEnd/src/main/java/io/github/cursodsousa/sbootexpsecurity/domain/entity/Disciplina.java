package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "disciplina")
public class Disciplina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da disciplina é obrigatório")
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false) // Não permite null
    private Curso curso;

    @OneToMany(mappedBy = "disciplina")
    private List<Monitoria> monitorias = new ArrayList<>();

    // Métodos setter modificados para manter a consistência
    public void setCurso(Curso curso) {
        this.curso = curso;
        if (curso != null && !curso.getDisciplinas().contains(this)) {
            curso.getDisciplinas().add(this);
        }
    }
}