package com.deepsea.deep_sea.repository;

import com.deepsea.deep_sea.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Custom query method to find users by email during login verification
    Optional<User> findByEmail(String email);
}
