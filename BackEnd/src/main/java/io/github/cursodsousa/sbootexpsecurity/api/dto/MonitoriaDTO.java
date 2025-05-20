package io.github.cursodsousa.sbootexpsecurity.api.dto;



import io.github.cursodsousa.sbootexpsecurity.domain.entity.Monitoria;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MonitoriaDTO {

    @NotNull(message = "A quantidade de vagas é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser maior que zero")
    private Integer vagas;

    @NotNull(message = "A carga horária é obrigatória")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Integer cargaHor;

    @NotNull(message = "A data de início é obrigatória")
    private LocalDate inicioInscricoes;

    @NotNull(message = "A data final é obrigatória")
    private LocalDate fimInscricoes;

    @NotBlank(message = "A descrição da forma de seleção é obrigatório")
    private String formaSelecao;

    @NotNull(message = "A data de divulgação é obrigatória")
    private LocalDate dataDivulgacao;

    @NotNull(message = "A data de início é obrigatória")
    private LocalDate DataInicioMoni;

    @NotNull(message = "A data final é obrigatória")
    private LocalDate DataFimMoni;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String conteudoAv;

    public Monitoria toMonitoria(){
        Monitoria monitoria = new Monitoria();
        monitoria.setVagas(this.vagas);
        monitoria.setCargaHor(this.cargaHor);
        monitoria.setInicioInscricoes(this.inicioInscricoes);
        monitoria.setFimInscricoes(this.fimInscricoes);
        monitoria.setFormaSelecao(this.formaSelecao);
        monitoria.setDataDivulgacao(this.dataDivulgacao);
        monitoria.setDataInicioMoni(this.DataInicioMoni);
        monitoria.setDataInicioMoni(this.DataFimMoni);
        monitoria.setConteudoAv(this.conteudoAv);
        return monitoria;
    }

    public static MonitoriaDTO fromMonitoria(Monitoria monitoria){
        MonitoriaDTO dto = new MonitoriaDTO();
        dto.setVagas(monitoria.getVagas());
        dto.setCargaHor(monitoria.getCargaHor());
        dto.setInicioInscricoes(monitoria.getInicioInscricoes());
        dto.setFimInscricoes(monitoria.getFimInscricoes());
        dto.setFormaSelecao(monitoria.getFormaSelecao());
        dto.setDataDivulgacao(monitoria.getDataDivulgacao());
        dto.setDataInicioMoni(monitoria.getDataInicioMoni());
        dto.setDataFimMoni(monitoria.getDataFimMoni());
        dto.setConteudoAv(monitoria.getConteudoAv());
        return dto;
    }
}
