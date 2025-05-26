package io.github.cursodsousa.sbootexpsecurity.domain.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "monitoria")
public class Monitoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Disciplina disciplina;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Curso curso;

    @Column(nullable = false)
    private String semestre;

    @Column(nullable = false)
    private Integer cargaHoraria;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataTermino;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "monitoria_dias_semana", joinColumns = @JoinColumn(name = "monitoria_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "dia")
    private Set<DiaSemana> diasSemana;

    @Column(nullable = false)
    private LocalTime horarioInicio;

    @Column(nullable = false)
    private LocalTime horarioTermino;

    private String sala;
    private boolean bolsa;
    private BigDecimal valorBolsa;
    private String requisitos;
    private String atividades;
    private String alunoPreSelecionado;

    @Column(nullable = false)
    private boolean termosAceitos;

    @Enumerated(EnumType.STRING)
    private StatusMonitoria status = StatusMonitoria.PENDENTE;
    

}
