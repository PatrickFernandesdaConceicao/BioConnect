package io.github.cursodsousa.sbootexpsecurity.domain.service;


import io.github.cursodsousa.sbootexpsecurity.api.dto.MonitoriaDTO;
import io.github.cursodsousa.sbootexpsecurity.api.dto.MonitoriaResponseDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.*;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.CursoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DisciplinaRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.MonitoriaRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springdoc.api.OpenApiResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonitoriaService {

    @Autowired
    private MonitoriaRepository monitoriaRepository;
    @Autowired
    private DisciplinaRepository disciplinaRepository;
    @Autowired
    private CursoRepository cursoRepository;


    // Métodos principais
    public MonitoriaResponseDTO criarMonitoria(MonitoriaDTO dto) {
        validarMonitoria(dto);

        Monitoria monitoria = dtoParaEntidade(dto);
        monitoria.setStatus(StatusMonitoria.PENDENTE);
        monitoria = monitoriaRepository.save(monitoria);

        return entidadeParaResponseDTO(monitoria);
    }

    public MonitoriaResponseDTO buscarPorId(Long id) {
        Monitoria monitoria = monitoriaRepository.findById(id)
                .orElseThrow(() -> new OpenApiResourceNotFoundException("Monitoria não encontrada"));
        return entidadeParaResponseDTO(monitoria);
    }

    public List<MonitoriaResponseDTO> listarTodas() {
        return monitoriaRepository.findAll().stream()
                .map(this::entidadeParaResponseDTO)
                .collect(Collectors.toList());
    }

    public MonitoriaResponseDTO atualizarMonitoria(Long id, MonitoriaDTO dto) {
        Monitoria monitoriaExistente = monitoriaRepository.findById(id)
                .orElseThrow(() -> new OpenApiResourceNotFoundException("Monitoria não encontrada"));

        validarMonitoria(dto);
        atualizarEntidadeComDTO(monitoriaExistente, dto);

        Monitoria monitoriaAtualizada = monitoriaRepository.save(monitoriaExistente);
        return entidadeParaResponseDTO(monitoriaAtualizada);
    }

    public void deletarMonitoria(Long id) {
        if (!monitoriaRepository.existsById(id)) {
            throw new OpenApiResourceNotFoundException("Monitoria não encontrada");
        }
        monitoriaRepository.deleteById(id);
    }

    // Métodos de conversão
    private Monitoria dtoParaEntidade(MonitoriaDTO dto) {
        Monitoria monitoria = new Monitoria();

        monitoria.setDisciplina(disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new OpenApiResourceNotFoundException("Disciplina não encontrada")));

        monitoria.setCurso(cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new OpenApiResourceNotFoundException("Curso não encontrado")));

        monitoria.setSemestre(dto.getSemestre());
        monitoria.setCargaHoraria(dto.getCargaHoraria());
        monitoria.setDataInicio(dto.getDataInicio());
        monitoria.setDataTermino(dto.getDataTermino());
        monitoria.setDiasSemana(dto.getDiasSemana());
        monitoria.setHorarioInicio(dto.getHorarioInicio());
        monitoria.setHorarioTermino(dto.getHorarioTermino());
        monitoria.setSala(dto.getSala());
        monitoria.setBolsa(dto.isBolsa());
        monitoria.setValorBolsa(dto.getValorBolsa());
        monitoria.setRequisitos(dto.getRequisitos());
        monitoria.setAtividades(dto.getAtividades());
        monitoria.setAlunoPreSelecionado(dto.getAlunoPreSelecionado());
        monitoria.setTermosAceitos(dto.isTermosAceitos());

        return monitoria;
    }

    private MonitoriaResponseDTO entidadeParaResponseDTO(Monitoria monitoria) {
        MonitoriaResponseDTO responseDTO = new MonitoriaResponseDTO();

        // Mapear campos básicos
        responseDTO.setId(monitoria.getId());
        responseDTO.setDisciplinaId(monitoria.getDisciplina().getId());
        responseDTO.setDisciplinaNome(monitoria.getDisciplina().getNome());
        responseDTO.setCursoId(monitoria.getCurso().getId());
        responseDTO.setCursoNome(monitoria.getCurso().getNome());
        responseDTO.setSemestre(monitoria.getSemestre());
        responseDTO.setCargaHoraria(monitoria.getCargaHoraria());
        responseDTO.setDataInicio(monitoria.getDataInicio());
        responseDTO.setDataTermino(monitoria.getDataTermino());
        responseDTO.setDiasSemana(monitoria.getDiasSemana());
        responseDTO.setHorarioInicio(monitoria.getHorarioInicio());
        responseDTO.setHorarioTermino(monitoria.getHorarioTermino());
        responseDTO.setSala(monitoria.getSala());
        responseDTO.setBolsa(monitoria.isBolsa());
        responseDTO.setValorBolsa(monitoria.getValorBolsa());
        responseDTO.setRequisitos(monitoria.getRequisitos());
        responseDTO.setAtividades(monitoria.getAtividades());
        responseDTO.setAlunoPreSelecionado(monitoria.getAlunoPreSelecionado());
        responseDTO.setTermosAceitos(monitoria.isTermosAceitos());
        responseDTO.setStatus(monitoria.getStatus());

        return responseDTO;
    }

    private void atualizarEntidadeComDTO(Monitoria monitoria, MonitoriaDTO dto) {
        if (dto.getDisciplinaId() != null) {
            monitoria.setDisciplina(disciplinaRepository.findById(dto.getDisciplinaId())
                    .orElseThrow(() -> new OpenApiResourceNotFoundException("Disciplina não encontrada")));
        }

        if (dto.getCursoId() != null) {
            monitoria.setCurso(cursoRepository.findById(dto.getCursoId())
                    .orElseThrow(() -> new OpenApiResourceNotFoundException("Curso não encontrado")));
        }

        if (dto.getSemestre() != null) monitoria.setSemestre(dto.getSemestre());
        if (dto.getCargaHoraria() != null) monitoria.setCargaHoraria(dto.getCargaHoraria());
        if (dto.getDataInicio() != null) monitoria.setDataInicio(dto.getDataInicio());
        if (dto.getDataTermino() != null) monitoria.setDataTermino(dto.getDataTermino());
        if (dto.getDiasSemana() != null) monitoria.setDiasSemana(dto.getDiasSemana());
        if (dto.getHorarioInicio() != null) monitoria.setHorarioInicio(dto.getHorarioInicio());
        if (dto.getHorarioTermino() != null) monitoria.setHorarioTermino(dto.getHorarioTermino());
        if (dto.getSala() != null) monitoria.setSala(dto.getSala());
        monitoria.setBolsa(dto.isBolsa());
        if (dto.getValorBolsa() != null) monitoria.setValorBolsa(dto.getValorBolsa());
        if (dto.getRequisitos() != null) monitoria.setRequisitos(dto.getRequisitos());
        if (dto.getAtividades() != null) monitoria.setAtividades(dto.getAtividades());
        if (dto.getAlunoPreSelecionado() != null) monitoria.setAlunoPreSelecionado(dto.getAlunoPreSelecionado());
        monitoria.setTermosAceitos(dto.isTermosAceitos());
    }

    // Métodos de validação
    private void validarMonitoria(MonitoriaDTO dto) {
        validarDatas(dto.getDataInicio(), dto.getDataTermino());
        validarHorarios(dto.getHorarioInicio(), dto.getHorarioTermino());
        validarDiasSemana(dto.getDiasSemana());
        validarBolsa(dto);
    }

    private void validarDatas(LocalDate inicio, LocalDate termino) {
        if (inicio == null || termino == null) {
            throw new ValidationException("Datas de início e término são obrigatórias");
        }
        if (termino.isBefore(inicio)) {
            throw new ValidationException("Data de término deve ser posterior à data de início");
        }
    }

    private void validarHorarios(LocalTime inicio, LocalTime termino) {
        if (inicio == null || termino == null) {
            throw new ValidationException("Horários de início e término são obrigatórios");
        }
        if (termino.isBefore(inicio) || termino.equals(inicio)) {
            throw new ValidationException("Horário de término deve ser posterior ao horário de início");
        }
    }

    private void validarDiasSemana(Set<DiaSemana> diasSemana) {
        if (diasSemana == null || diasSemana.isEmpty()) {
            throw new ValidationException("Selecione pelo menos um dia da semana");
        }
    }

    private void validarBolsa(MonitoriaDTO dto) {
        if (dto.isBolsa() && (dto.getValorBolsa() == null || dto.getValorBolsa().compareTo(BigDecimal.ZERO) <= 0)) {
            throw new ValidationException("Valor da bolsa é obrigatório quando a monitoria é remunerada");
        }
    }
}