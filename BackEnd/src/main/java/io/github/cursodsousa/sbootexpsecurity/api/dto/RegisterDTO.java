package io.github.cursodsousa.sbootexpsecurity.api.dto;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;

public record RegisterDTO(String login, String senha, String nome, String email, UserRole role) {

}
