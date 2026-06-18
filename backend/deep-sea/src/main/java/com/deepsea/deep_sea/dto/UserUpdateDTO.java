package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @NotBlank(message = "Email modification state target cannot be empty")
    @Email(message = "Invalid email formatting layout syntax structure")
    private String email;

    @NotBlank(message = "Affiliated tracking institution is required")
    private String institution;
}
