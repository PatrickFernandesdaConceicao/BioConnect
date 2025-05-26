package io.github.cursodsousa.sbootexpsecurity.api.dto;



import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.DiaSemana;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MonitoriaDTO {

    private Long id;
    private Long disciplinaId;
    private Long cursoId;
    private String semestre;
    private Integer cargaHoraria;
    private LocalDate dataInicio;
    private LocalDate dataTermino;
    private Set<DiaSemana> diasSemana;
    private LocalTime horarioInicio;
    private LocalTime horarioTermino;
    private String sala;
    private boolean bolsa;
    private BigDecimal valorBolsa;
    private String requisitos;
    private String atividades;
    private String alunoPreSelecionado;
    private boolean termosAceitos;

}
