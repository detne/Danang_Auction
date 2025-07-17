package com.danang_auction.repository;

import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.UserStatus;
import com.danang_auction.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.status = :status")
    List<User> findByStatus(@Param("status") UserStatus status);

    @Query("SELECT u FROM User u WHERE u.username = :username OR u.email = :username")
    Optional<User> findByUsernameOrEmail(@Param("username") String username);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    Long countByStatus(@Param("status") UserStatus status);
}