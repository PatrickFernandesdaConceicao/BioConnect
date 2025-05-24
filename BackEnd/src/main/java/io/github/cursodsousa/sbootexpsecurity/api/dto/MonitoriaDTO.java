package io.github.cursodsousa.sbootexpsecurity.api.dto;



import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Monitoria;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.AssertTrue;
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

    @NotNull(message = "O ID do evento é obrigatório")
    private Long disciplinaId;

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

    @NotBlank(message = "Conteúdo é obrigatório")
    private String diasSemana;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String horarioInicio;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String horarioFim;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String sala;

    @AssertTrue(message = "Valor da bolsa é obrigatório quando bolsa é true")
    public boolean isValorBolsaValid() {
        return !bolsa || valorBolsa != null;
    }
    private boolean bolsa;

    private Double valorBolsa;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String requisitos;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String atividades;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String alunoPreSelecionado;

    @NotNull(message = "O ID do disciplina é obrigatório")
    private Long disciplinaID;

    @NotNull(message = "O ID do curso é obrigatório")
    private Long cursoId;

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
        monitoria.setDiasSemana(this.diasSemana);
        monitoria.setHorarioInicio(this.horarioInicio);
        monitoria.setHorarioFim(this.horarioFim);
        monitoria.setSala(this.sala);
        monitoria.setBolsa(this.bolsa);
        monitoria.setValorBolsa(this.valorBolsa);
        monitoria.setRequisitos(this.requisitos);
        monitoria.setAtividades(this.atividades);
        monitoria.setAlunoPreSelecionado(this.alunoPreSelecionado);

        Curso curso = new Curso();
        curso.setId(this.cursoId);
        monitoria.setCurso(curso);

        Disciplina disciplina = new Disciplina();
        disciplina.setId(this.disciplinaId);
        monitoria.setDisciplina(disciplina);

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
        dto.setDiasSemana(monitoria.getDiasSemana());
        dto.setHorarioInicio(monitoria.getHorarioInicio());
        dto.setHorarioFim(monitoria.getHorarioFim());
        dto.setSala(monitoria.getSala());
        dto.setBolsa(monitoria.isBolsa());
        dto.setValorBolsa(monitoria.getValorBolsa());
        dto.setRequisitos(monitoria.getRequisitos());
        dto.setAtividades(monitoria.getAtividades());
        dto.setAlunoPreSelecionado(monitoria.getAlunoPreSelecionado());

        return dto;
    }
}
