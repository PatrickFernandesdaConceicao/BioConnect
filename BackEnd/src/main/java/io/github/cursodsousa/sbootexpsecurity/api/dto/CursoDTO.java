package io.github.cursodsousa.sbootexpsecurity.api.dto;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CursoDTO {

    private Long id;

    @NotBlank(message = "O nome do curso é obrigatório")
    @Size(max = 100, message = "O nome do curso deve ter no máximo 100 caracteres")
    private String nome;



    public Curso toCurso(){
        Curso curso = new Curso();
        curso.setId(this.id);
        curso.setNome(this.nome);
        return curso;
    }

    public static CursoDTO fromCurso(Curso curso){
        CursoDTO dto = new CursoDTO();
        dto.setNome(curso.getNome());
        return dto;
    }
}
