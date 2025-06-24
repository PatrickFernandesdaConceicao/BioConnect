package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.api.dto.CriarProjetoRequest;
import io.github.cursodsousa.sbootexpsecurity.api.dto.ProjetoDTO;
import io.github.cursodsousa.sbootexpsecurity.config.ValidacaoException;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Projeto;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.ProjetoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.StatusProjeto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;

    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    @Transactional
    public ProjetoDTO criarProjeto(CriarProjetoRequest request) {
        validarDadosProjeto(request);

        Projeto projeto = new Projeto();
        projeto.setTitulo(request.getTitulo());
        projeto.setDescricao(request.getDescricao());
        projeto.setObjetivos(request.getObjetivos());
        projeto.setJustificativa(request.getJustificativa());

        if (request.getDataInicio() != null && !request.getDataInicio().isEmpty()) {
            projeto.setDataInicio(LocalDate.parse(request.getDataInicio(), DateTimeFormatter.ISO_DATE));
        }

        if (request.getDataTermino() != null && !request.getDataTermino().isEmpty()) {
            projeto.setDataTermino(LocalDate.parse(request.getDataTermino(), DateTimeFormatter.ISO_DATE));
        }

        projeto.setAreaConhecimento(request.getAreaConhecimento());
        projeto.setPossuiOrcamento(request.isPossuiOrcamento());

        if (request.isPossuiOrcamento() && request.getOrcamento() != null && !request.getOrcamento().isEmpty()) {
            projeto.setOrcamento(Double.parseDouble(request.getOrcamento().replace(",", ".")));
        }

        projeto.setUrlEdital(request.getUrlEdital());
        projeto.setAceitouTermos(request.isAceitouTermos());
        projeto.setTipoProjeto(request.getTipoProjeto());

        if (request.getLimiteParticipantes() != null && !request.getLimiteParticipantes().isEmpty()) {
            projeto.setLimiteParticipantes(Integer.parseInt(request.getLimiteParticipantes()));
        }

        projeto.setPublicoAlvo(request.getPublicoAlvo());
        projeto.setMetodologia(request.getMetodologia());
        projeto.setResultadosEsperados(request.getResultadosEsperados());
        projeto.setPalavrasChave(request.getPalavrasChave());

        if (request.getEmailsParticipantes() != null && !request.getEmailsParticipantes().isEmpty()) {
            List<String> emails = Arrays.stream(request.getEmailsParticipantes().split("[,\n]"))
                    .map(String::trim)
                    .filter(email -> !email.isEmpty())
                    .collect(Collectors.toList());
            projeto.setEmailsParticipantes(emails);
        }

        Projeto projetoSalvo = projetoRepository.save(projeto);
        return converterParaDTO(projetoSalvo);
    }

    private void validarDadosProjeto(CriarProjetoRequest request) {
        if (request.getTitulo() == null || request.getTitulo().length() < 5) {
            throw new ValidacaoException("O título deve ter pelo menos 5 caracteres");
        }

        if (request.getDescricao() == null || request.getDescricao().length() < 20) {
            throw new ValidacaoException("A descrição deve ter pelo menos 20 caracteres");
        }

        if (request.getObjetivos() == null || request.getObjetivos().length() < 20) {
            throw new ValidacaoException("Os objetivos devem ter pelo menos 20 caracteres");
        }

        if (request.getAreaConhecimento() == null || request.getAreaConhecimento().isEmpty()) {
            throw new ValidacaoException("Selecione uma área de conhecimento");
        }

        if (request.getTipoProjeto() == null || request.getTipoProjeto().isEmpty()) {
            throw new ValidacaoException("Selecione o tipo de projeto");
        }

        if (request.getDataInicio() != null && !request.getDataInicio().isEmpty() &&
                request.getDataTermino() != null && !request.getDataTermino().isEmpty()) {

            LocalDate inicio = LocalDate.parse(request.getDataInicio(), DateTimeFormatter.ISO_DATE);
            LocalDate termino = LocalDate.parse(request.getDataTermino(), DateTimeFormatter.ISO_DATE);

            if (termino.isBefore(inicio) || termino.isEqual(inicio)) {
                throw new ValidacaoException("A data de término deve ser posterior à data de início");
            }
        }

        if (!request.isAceitouTermos()) {
            throw new ValidacaoException("Você deve aceitar os termos e condições");
        }
    }

    private ProjetoDTO converterParaDTO(Projeto projeto) {
        return ProjetoDTO.builder()
                .id(projeto.getId())
                .titulo(projeto.getTitulo())
                .descricao(projeto.getDescricao())
                .objetivos(projeto.getObjetivos())
                .justificativa(projeto.getJustificativa())
                .dataInicio(projeto.getDataInicio())
                .dataTermino(projeto.getDataTermino())
                .areaConhecimento(projeto.getAreaConhecimento())
                .possuiOrcamento(projeto.isPossuiOrcamento())
                .orcamento(projeto.getOrcamento())
                .urlEdital(projeto.getUrlEdital())
                .aceitouTermos(projeto.isAceitouTermos())
                .tipoProjeto(projeto.getTipoProjeto())
                .limiteParticipantes(projeto.getLimiteParticipantes())
                .publicoAlvo(projeto.getPublicoAlvo())
                .metodologia(projeto.getMetodologia())
                .resultadosEsperados(projeto.getResultadosEsperados())
                .palavrasChave(projeto.getPalavrasChave())
                .emailsParticipantes(projeto.getEmailsParticipantes())
                .build();
    }

    @Transactional
    public ProjetoDTO atualizarProjeto(Long id, ProjetoDTO request) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Projeto não encontrado"));

        if (request.getTitulo() != null) projeto.setTitulo(request.getTitulo());
        if (request.getDescricao() != null) projeto.setDescricao(request.getDescricao());
        if (request.getObjetivos() != null) projeto.setObjetivos(request.getObjetivos());
        if (request.getJustificativa() != null) projeto.setJustificativa(request.getJustificativa());
        if (request.getDataInicio() != null) projeto.setDataInicio(request.getDataInicio());
        if (request.getDataTermino() != null) projeto.setDataTermino(request.getDataTermino());
        if (request.getAreaConhecimento() != null) projeto.setAreaConhecimento(request.getAreaConhecimento());
        if (request.getPossuiOrcamento() != null) projeto.setPossuiOrcamento(request.getPossuiOrcamento()); // Agora usa get
        if (request.getOrcamento() != null) projeto.setOrcamento(request.getOrcamento());
        if (request.getUrlEdital() != null) projeto.setUrlEdital(request.getUrlEdital());
        if (request.getAceitouTermos() != null) projeto.setAceitouTermos(request.getAceitouTermos()); // Agora usa get
        if (request.getTipoProjeto() != null) projeto.setTipoProjeto(request.getTipoProjeto());
        if (request.getLimiteParticipantes() != null) projeto.setLimiteParticipantes(request.getLimiteParticipantes());
        if (request.getPublicoAlvo() != null) projeto.setPublicoAlvo(request.getPublicoAlvo());
        if (request.getMetodologia() != null) projeto.setMetodologia(request.getMetodologia());
        if (request.getResultadosEsperados() != null) projeto.setResultadosEsperados(request.getResultadosEsperados());
        if (request.getPalavrasChave() != null) projeto.setPalavrasChave(request.getPalavrasChave());
        if (request.getEmailsParticipantes() != null) projeto.setEmailsParticipantes(request.getEmailsParticipantes());

        Projeto atualizado = projetoRepository.save(projeto);
        return converterParaDTO(atualizado);
    }

    @Transactional(readOnly = true)
    public List<ProjetoDTO> listarTodos() {
        return projetoRepository.findAll()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Projeto não encontrado"));
        projetoRepository.delete(projeto);
    }

    @Transactional
    public ProjetoDTO aprovarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Projeto não encontrado"));

        projeto.setStatus(StatusProjeto.APROVADO);
        Projeto atualizado = projetoRepository.save(projeto);
        return converterParaDTO(atualizado);
    }

    @Transactional
    public ProjetoDTO rejeitarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Projeto não encontrado"));

        projeto.setStatus(StatusProjeto.REJEITADO);
        Projeto atualizado = projetoRepository.save(projeto);
        return converterParaDTO(atualizado);
    }

    @Transactional(readOnly = true)
    public ProjetoDTO buscarProjetoPorId(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Projeto não encontrado"));
        return converterParaDTO(projeto);
    }


}