package io.github.cursodsousa.sbootexpsecurity.domain.entity;

public enum UserRole {
    ADMIN("admin"),
    USER("user");

    private String role;

    UserRole(String Role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }


}
