package com.deepsea.deep_sea.dto;

import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserResponseDTO {
    private UUID id;
    private String name;
    private String email;
    private UserRole role;
    private String specialization;
    private String institution;
    private boolean enabled;

    public static UserResponseDTO fromEntity(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .specialization(user.getSpecialization())
                .institution(user.getInstitution())
                .enabled(user.isEnabled())
                .build();
    }
}
