package io.github.cursodsousa.sbootexpsecurity.api.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String objetivos;
    private String justificativa;
    private LocalDate dataInicio;
    private LocalDate dataTermino;
    private String areaConhecimento;
    private Boolean possuiOrcamento;
    private Double orcamento;
    private String urlEdital;
    private Boolean aceitouTermos;
    private String tipoProjeto;
    private Integer limiteParticipantes;
    private String publicoAlvo;
    private String metodologia;
    private String resultadosEsperados;
    private String palavrasChave;
    private List<String> emailsParticipantes;
    private List<DocumentoDTO> documentos;
}