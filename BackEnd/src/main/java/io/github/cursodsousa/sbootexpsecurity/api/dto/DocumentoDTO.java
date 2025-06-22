package io.github.cursodsousa.sbootexpsecurity.api.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoDTO {
    private Long id;
    private String nomeArquivo;
    private String tipoArquivo;
    private Long tamanho;
    private String caminhoArquivo;
}