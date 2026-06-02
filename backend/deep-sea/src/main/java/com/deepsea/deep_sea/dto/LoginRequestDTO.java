package com.deepsea.deep_sea.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {
	
	@NotNull(message = "Email is required")
    private String email;
	
	@NotNull(message = "Password is required")
    private String password;

}
