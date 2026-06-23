package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.User;
import com.deepsea.deep_sea.model.enums.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    
    Page<User> findAllByRole(UserRole role, Pageable pageable);

}
