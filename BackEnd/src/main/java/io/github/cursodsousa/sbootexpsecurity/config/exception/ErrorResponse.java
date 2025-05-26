package io.github.cursodsousa.sbootexpsecurity.config.exception;

import lombok.Data;

import java.util.List;

@Data
public class ErrorResponse {
    private String code;
    private String message;
    private int status;
    private List<String> details;

    public ErrorResponse(String code, String message, int status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    public ErrorResponse(String code, String message, int status, List<String> details) {
        this.code = code;
        this.message = message;
        this.status = status;
        this.details = details;
    }

    // Getters e Setters
}