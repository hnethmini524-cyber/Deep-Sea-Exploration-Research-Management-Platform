package com.deepsea.deep_sea.dto;

import com.deepsea.deep_sea.model.enums.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
        private String token;
        private String email;
        private UserRole role;
        private String name;
        
        public AuthResponseDTO(String token, String email, UserRole role, String name) {
            this.token = token;
            this.email = email;
            this.role = role;
            this.name = name;
        }

        public AuthResponseDTO() {}
}