package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeArquivo;
    private String tipoArquivo;
    private Long tamanho;
    private String caminhoArquivo;

    @ManyToOne
    @JoinColumn(name = "projeto_id")  // Coluna FK em `Documento`
    private Projeto projeto;
}