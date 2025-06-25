package io.github.cursodsousa.sbootexpsecurity.domain.entity;

public enum StatusProjeto {
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    EM_ANDAMENTO("Em Andamento"),
    CONCLUIDO("Concluído"),
    REJEITADO("Rejeitado"),
    CANCELADO("Cancelado"),
    SUSPENSO("Suspenso");

    private final String descricao;

    StatusProjeto(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
