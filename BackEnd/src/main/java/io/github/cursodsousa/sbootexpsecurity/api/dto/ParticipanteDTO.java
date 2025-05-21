package io.github.cursodsousa.sbootexpsecurity.api.dto;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.ParticipanteEvento;
import lombok.Data;

@Data
public class ParticipanteDTO {
    private Long id;
    private String nome;
    private String email;

    public static ParticipanteDTO fromParticipante(ParticipanteEvento participante) {
        ParticipanteDTO dto = new ParticipanteDTO();
        dto.setId(participante.getId());
        dto.setNome(participante.getNome());
        dto.setEmail(participante.getEmail());
        return dto;
    }
}
