package com.deepsea.deep_sea.dto;

//import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.List;
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
    
    private List<String> assignedMissionNames;
}
