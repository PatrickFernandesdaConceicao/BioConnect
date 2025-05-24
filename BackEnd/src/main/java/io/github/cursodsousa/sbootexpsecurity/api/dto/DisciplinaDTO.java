package io.github.cursodsousa.sbootexpsecurity.api.dto;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DisciplinaDTO {
    @NotBlank(message = "O nome da disciplina é obrigatório")
    private String nome;

    @NotNull(message = "O ID do curso é obrigatório")
    private Long cursoId;

    public Disciplina toDisciplina(){
        Disciplina disciplina = new Disciplina();
        disciplina.setNome(this.nome);

        // Cria um curso apenas com o ID para evitar buscar o objeto completo
        Curso curso = new Curso();
        curso.setId(this.cursoId);
        disciplina.setCurso(curso);

        return disciplina;
    }

    public static DisciplinaDTO fromDisciplina(Disciplina disciplina){
        DisciplinaDTO dto = new DisciplinaDTO();
        dto.setNome(disciplina.getNome());
        dto.setCursoId(disciplina.getCurso() != null ? disciplina.getCurso().getId() : null);
        return dto;
    }
}
