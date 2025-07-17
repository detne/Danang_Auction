package com.danang_auction.repository;

import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    BigDecimal sumRevenue(@Param("status") PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status AND FUNCTION('MONTH', p.timestamp) = :month")
    BigDecimal sumRevenueByMonth(@Param("status") PaymentStatus status, @Param("month") int month);
}