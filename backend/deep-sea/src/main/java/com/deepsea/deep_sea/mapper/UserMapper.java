package com.deepsea.deep_sea.mapper;

import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

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
