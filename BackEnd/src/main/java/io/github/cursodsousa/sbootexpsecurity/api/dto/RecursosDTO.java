package io.github.cursodsousa.sbootexpsecurity.api.dto;


import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Recursos;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RecursosDTO {
    @NotBlank(message = "O nome do recurso é obrigatório")
    private String recurso;

    private String descricao;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser maior que zero")
    private Integer qtd;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float valorUnit;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float valorAprovado;

    @NotNull(message = "O ID do evento é obrigatório")
    private Long eventoId;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float totalSolicitado;


    public Recursos toRecursos(Evento evento) {
        Recursos recursos = new Recursos();
        recursos.setRecurso(this.recurso);
        recursos.setDescricao(this.descricao);
        recursos.setQtd(this.qtd);
        recursos.setValorUnit(this.valorUnit);
        recursos.setValorAprovado(this.valorAprovado);
        recursos.setEvento(evento);
        recursos.setTotalSolicitado(this.totalSolicitado);
        return recursos;
    }

    public static RecursosDTO fromRecursos(Recursos recursos) {
        RecursosDTO dto = new RecursosDTO();
        dto.setRecurso(recursos.getRecurso());
        dto.setDescricao(recursos.getDescricao());
        dto.setQtd(recursos.getQtd());
        dto.setValorUnit(recursos.getValorUnit());
        dto.setValorAprovado(recursos.getValorAprovado());
        dto.setEventoId(recursos.getEvento() != null ? recursos.getEvento().getId() : null);
        dto.setTotalSolicitado(recursos.getTotalSolicitado());
        return dto;
    }
}