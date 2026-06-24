package com.deepsea.deep_sea.dto;

import java.util.UUID;

import com.deepsea.deep_sea.model.enums.UserRole;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
	    private UUID id;
        private String token;
        private String email;
        private UserRole role;
        private String name;
        
        public AuthResponseDTO(UUID id, String token, String email, UserRole role, String name) {
        	this.id = id;
            this.token = token;
            this.email = email;
            this.role = role;
            this.name = name;
        }

        public AuthResponseDTO() {}
}