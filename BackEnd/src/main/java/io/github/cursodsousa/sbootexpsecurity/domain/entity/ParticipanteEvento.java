package io.github.cursodsousa.sbootexpsecurity.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "participante_evento")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipanteEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    private String email;

    @ManyToOne
    @JoinColumn(name = "evento_id")  // Referência para o evento
    private Evento evento;  // Relacionamento com o Evento
}
