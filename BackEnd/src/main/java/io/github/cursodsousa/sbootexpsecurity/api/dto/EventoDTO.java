package io.github.cursodsousa.sbootexpsecurity.api.dto;



import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventoDTO {

    @NotNull(message = "O ID do evento é obrigatório")
    private Long eventoId;

    @NotBlank(message = "O título é obrigatório")
    @Size(max = 100, message = "O título não pode ter mais de 100 caracteres")
    private String titulo;

    @NotBlank(message = "O curso é obrigatório")
    private String curso;

    @NotNull(message = "A data de início é obrigatória")
    private LocalDate dataInicio;

    @NotNull(message = "A data do término é obrigatória")
    private LocalDate dataTermino;

    @NotBlank(message = "O local é obrigatório")
    private String local;

    @NotBlank(message = "A justificativa é obrigatória")
    private String justificativa;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float vlTotalAprovado;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float vlTotalSolicitado;


    public Evento toEvento() {
        Evento evento = new Evento();
        evento.setTitulo(this.titulo);
        evento.setCurso(this.curso);
        evento.setDataInicio(this.dataInicio);
        evento.setDataTermino(this.dataTermino);
        evento.setLocal(this.local);
        evento.setJustificativa(this.justificativa);
        evento.setVlTotalAprovado(this.vlTotalAprovado);
        evento.setVlTotalSolicitado(this.vlTotalSolicitado);
        return evento;
    }

    public static EventoDTO fromEvento(Evento evento) {
        EventoDTO dto = new EventoDTO();
        dto.setEventoId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setCurso(evento.getCurso());
        dto.setDataInicio(evento.getDataInicio());
        dto.setDataTermino(evento.getDataTermino());
        dto.setLocal(evento.getLocal());
        dto.setJustificativa(evento.getJustificativa());
        dto.setVlTotalAprovado(evento.getVlTotalAprovado());
        dto.setVlTotalSolicitado(evento.getVlTotalSolicitado());
        return dto;
    }
}