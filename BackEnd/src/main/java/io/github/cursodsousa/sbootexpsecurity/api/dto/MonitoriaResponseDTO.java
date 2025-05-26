package io.github.cursodsousa.sbootexpsecurity.api.dto;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.StatusMonitoria;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MonitoriaResponseDTO extends MonitoriaDTO{
    private String disciplinaNome;
    private String cursoNome;
    private StatusMonitoria status;
}
