package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.ResearcherInviteDTO;
import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;
import org.springframework.stereotype.Component;


@Component
public class UserMapper {

    public User toInviteEntity(ResearcherInviteDTO dto, String temporaryEncodedPassword) {
        if (dto == null) return null;

        return User.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().toLowerCase().trim())
                .passwordHash(temporaryEncodedPassword)
                .role(UserRole.RESEARCHER)
                .specialization(dto.getSpecialization() != null ? dto.getSpecialization().trim() : null)
                .institution(dto.getInstitution().trim())
                .enabled(false)
                .build();
    }

    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;

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