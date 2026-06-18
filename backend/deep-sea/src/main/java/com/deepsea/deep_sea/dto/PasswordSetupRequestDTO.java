package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordSetupRequestDTO {
    @NotBlank(message = "Token identifier is required")
    private String token;

    @NotBlank(message = "Password parameter cannot be blank")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters long")
    private String password;
}