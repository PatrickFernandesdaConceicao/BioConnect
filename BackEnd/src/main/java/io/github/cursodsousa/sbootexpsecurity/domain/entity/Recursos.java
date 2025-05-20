package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recursos")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Recursos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do recurso é obrigatório")
    private String recurso;

    private String descricao;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser maior que zero")
    private Integer qtd;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float valorUnit;

    private Float valorAprovado;

    @AssertTrue(message = "O valor aprovado não pode ser maior que o total solicitado")
    public boolean valorAprovadoValido() {
        return valorAprovado == null || totalSolicitado == null || valorAprovado <= totalSolicitado;
    }

    @ManyToOne //Um recurso possui um evento
    @JoinColumn(name = "evento_id") //foreing key
    private Evento evento;

    @Transient
    private Float totalSolicitado;

    @PrePersist
    @PreUpdate
    public void calcularTotalSolicitado() {
        if (qtd != null && valorUnit != null) {
            this.totalSolicitado = qtd * valorUnit;
        }
    }

}