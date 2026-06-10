package com.deepsea.deep_sea.service;

import com.deepsea.deep_sea.dto.UserResponseDTO;
import com.deepsea.deep_sea.exception.ResourceNotFoundException;
import com.deepsea.deep_sea.mapper.UserMapper;
import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;
import com.deepsea.deep_sea.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(
            UserRepository userRepository,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponseDTO> findUsersByRole(
            UserRole role
    ) {

        return userRepository.findAllByRole(role)
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    public UserResponseDTO findUserById(UUID id) {

        return userRepository.findById(id)
                .map(userMapper::toResponseDTO)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));
    }

    public User getUserEntityByEmail(
            String email
    ) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));
    }
}