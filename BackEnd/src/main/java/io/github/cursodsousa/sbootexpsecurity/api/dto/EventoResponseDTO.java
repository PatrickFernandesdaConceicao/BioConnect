package io.github.cursodsousa.sbootexpsecurity.api.dto;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class EventoResponseDTO {
    private Long id;
    public String titulo;
    public String curso;
    public String dataInicio;
    public String dataTermino;
    public String local;
    public String justificativa;
    public @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo") Float vlTotalSolicitado;
    public @NotNull(message = "O valor unitário é obrigatório")
    @Min(value = 0, message = "O valor unitário não pode ser negativo") Float vlTotalAprovado;
    public List<ParticipanteDTO> participantes;

    public static EventoResponseDTO fromEvento(Evento evento) {
        EventoResponseDTO dto = new EventoResponseDTO();
        dto.setId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setCurso(evento.getCurso());
        dto.setDataInicio(evento.getDataInicio().toString());  // convertendo LocalDate para String
        dto.setDataTermino(evento.getDataTermino().toString());
        dto.setLocal(evento.getLocal());
        dto.setJustificativa(evento.getJustificativa());
        dto.setVlTotalSolicitado(evento.getVlTotalSolicitado());
        dto.setVlTotalAprovado(evento.getVlTotalAprovado());

        if (evento.getParticipanteEventos() != null) {
            dto.setParticipantes(
                    evento.getParticipanteEventos().stream()
                            .map(pe -> {
                                ParticipanteDTO pDto = new ParticipanteDTO();
                                pDto.setId(pe.getId());
                                pDto.setNome(pe.getNome());
                                pDto.setEmail(pe.getEmail());
                                return pDto;
                            })
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }}