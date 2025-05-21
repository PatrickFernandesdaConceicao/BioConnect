package io.github.cursodsousa.sbootexpsecurity.domain.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "monitoria")
public class Monitoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    //Uma disciplina tem varia monitorias
    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    //@ManyToOne
    //@Column(name = "monitor_id")
    //private Pessoa monitor;

}
