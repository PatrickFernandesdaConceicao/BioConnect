package io.github.cursodsousa.sbootexpsecurity.api.dto;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DisciplinaDTO {

    @NotBlank(message = "O nome da disciplina é obrigatório")
    private String nome;

    private Long cursoId;

    public Disciplina toDisciplina(){
        Disciplina disciplina = new Disciplina();
        disciplina.setNome(this.nome);
        return disciplina;
    }

    public static DisciplinaDTO fromDisciplina(Disciplina disciplina){
        DisciplinaDTO dto = new DisciplinaDTO();
        dto.setNome(disciplina.getNome());
        return dto;
    }
}
