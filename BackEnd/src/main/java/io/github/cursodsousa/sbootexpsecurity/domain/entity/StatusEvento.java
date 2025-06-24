package io.github.cursodsousa.sbootexpsecurity.domain.entity;

public enum StatusEvento {
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    REJEITADO("Rejeitado"),
    CANCELADO("Cancelado"),
    EM_ANDAMENTO("Em Andamento"),
    CONCLUIDO("Concluído");

    private final String descricao;

    StatusEvento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
