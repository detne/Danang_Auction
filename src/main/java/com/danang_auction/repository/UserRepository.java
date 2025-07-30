package com.danang_auction.repository;

import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Thêm phương thức tùy chỉnh nếu cần (ví dụ: tìm user theo status)
    @Query("SELECT u FROM User u WHERE u.status = :status")
    List<User> findByStatus(@Param("status") UserStatus status);

    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countUsersByRoleRaw();

    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    List<Object[]> countUsersByStatusRaw();

    default Map<String, Long> countByRole() {
        Map<String, Long> map = new HashMap<>();
        for (Object[] obj : countUsersByRoleRaw()) {
            map.put(obj[0].toString(), (Long) obj[1]);
        }
        return map;
    }

    default Map<String, Long> countByStatus() {
        Map<String, Long> map = new HashMap<>();
        for (Object[] obj : countUsersByStatusRaw()) {
            map.put(obj[0].toString(), (Long) obj[1]);
        }
        return map;
    }

    @Query("SELECT u FROM User u WHERE u.verified = false AND u.rejectedReason IS NULL")
    List<User> findPendingUsers();

    @Query("SELECT u FROM User u WHERE u.verified = true")
    List<User> findApprovedUsers();

    @Query("SELECT u FROM User u WHERE u.verified = false AND u.rejectedReason IS NOT NULL")
    List<User> findRejectedUsers();

}