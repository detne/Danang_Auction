package com.danang_auction.repository;

import com.danang_auction.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<com.danang_auction.model.entity.User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}