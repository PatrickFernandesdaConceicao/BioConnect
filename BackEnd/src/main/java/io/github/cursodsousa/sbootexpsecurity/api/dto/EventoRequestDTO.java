package io.github.cursodsousa.sbootexpsecurity.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class EventoRequestDTO {
    public String titulo;
    public String curso;
    public String dataInicio;
    public String dataTermino;
    public String local;
    public String justificativa;
    public @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo") Float vlTotalSolicitado;
    public @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo") Float vlTotalAprovado;
    public List<ParticipanteDTO> participantes;
}
