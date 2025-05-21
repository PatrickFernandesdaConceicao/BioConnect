package io.github.cursodsousa.sbootexpsecurity.api.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriarProjetoRequest {
    private String titulo;
    private String descricao;
    private String objetivos;
    private String justificativa;
    private String dataInicio;
    private String dataTermino;
    private String areaConhecimento;
    private boolean possuiOrcamento;
    private String orcamento;
    private String urlEdital;
    private boolean aceitouTermos;
    private String tipoProjeto;
    private String limiteParticipantes;
    private String publicoAlvo;
    private String metodologia;
    private String resultadosEsperados;
    private String palavrasChave;
    private String emailsParticipantes;
}