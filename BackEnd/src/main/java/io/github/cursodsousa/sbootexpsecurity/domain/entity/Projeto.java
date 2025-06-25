package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projeto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String objetivos;

    @Column(columnDefinition = "TEXT")
    private String justificativa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusProjeto status = StatusProjeto.PENDENTE;

    private LocalDate dataInicio;
    private LocalDate dataTermino;

    @Column(nullable = false)
    private String areaConhecimento;

    private boolean possuiOrcamento;
    private Double orcamento;
    private String urlEdital;
    private boolean aceitouTermos;

    @Column(nullable = false)
    private String tipoProjeto;

    private Integer limiteParticipantes;
    private String publicoAlvo;

    @Column(columnDefinition = "TEXT")
    private String metodologia;

    @Column(columnDefinition = "TEXT")
    private String resultadosEsperados;

    private String palavrasChave;

    @ElementCollection
    private List<String> emailsParticipantes;

    @OneToMany(mappedBy = "projeto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Documento> documentos;
}
