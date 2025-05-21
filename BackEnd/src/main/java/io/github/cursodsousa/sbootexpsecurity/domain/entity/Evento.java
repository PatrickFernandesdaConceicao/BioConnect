package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "evento")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParticipanteEvento> participanteEventos;

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    private String curso; //verificar


    @NotNull(message = "A data de início é obrigatória")
    private LocalDate dataInicio;

    @NotNull(message = "A data do término é obrigatória")
    private LocalDate dataTermino;

    @NotBlank(message = "O local é obrigatório")
    private String local;

    @NotBlank(message = "A justificativa é obrigatória")
    private String justificativa;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float vlTotalAprovado;

    @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo")
    private Float vlTotalSolicitado;

    @OneToMany(mappedBy = "evento") //um evento para varios recursos
    private List<Recursos> recurso;

    @AssertTrue(message = "A data de término deve ser após a data de início")
    public boolean dataTerminoValidada() {
        return dataTermino == null || dataTermino.isAfter(dataInicio);
    }
}