package io.github.cursodsousa.sbootexpsecurity.domain.service;

import io.github.cursodsousa.sbootexpsecurity.api.dto.DocumentoDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Documento;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DocumentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final Path rootLocation = Paths.get("uploads");

    public DocumentoService(DocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório de uploads", e);
        }
    }

    @Transactional
    public DocumentoDTO salvarDocumento(MultipartFile arquivo) {
        try {
            String nomeOriginal = arquivo.getOriginalFilename();
            String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
            String nomeArquivo = UUID.randomUUID() + extensao;

            Files.copy(arquivo.getInputStream(), this.rootLocation.resolve(nomeArquivo));

            Documento documento = new Documento();
            documento.setNomeArquivo(nomeOriginal);
            documento.setTipoArquivo(arquivo.getContentType());
            documento.setTamanho(arquivo.getSize());
            documento.setCaminhoArquivo(nomeArquivo);

            Documento salvo = documentoRepository.save(documento);
            return converterParaDTO(salvo);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao armazenar arquivo", e);
        }
    }

    private DocumentoDTO converterParaDTO(Documento documento) {
        return DocumentoDTO.builder()
                .id(documento.getId())
                .nomeArquivo(documento.getNomeArquivo())
                .tipoArquivo(documento.getTipoArquivo())
                .tamanho(documento.getTamanho())
                .caminhoArquivo(documento.getCaminhoArquivo())
                .build();
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarTodos() {
        return documentoRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DocumentoDTO buscarPorId(Long id) {
        Documento doc = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
        return converterParaDTO(doc);
    }

    @Transactional
    public void deletar(Long id) {
        Documento doc = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
        documentoRepository.delete(doc);
    }

    @Transactional
    public DocumentoDTO atualizarParcial(Long id, DocumentoDTO dto) {
        Documento doc = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        if (dto.getNomeArquivo() != null) {
            doc.setNomeArquivo(dto.getNomeArquivo());
        }
        if (dto.getTipoArquivo() != null) {
            doc.setTipoArquivo(dto.getTipoArquivo());
        }

        Documento atualizado = documentoRepository.save(doc);
        return converterParaDTO(atualizado);
    }
}