package com.danang_auction.repository;

import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // // Tổng doanh thu đúng field `price`
    // @Query("SELECT SUM(p.price) FROM Payment p WHERE p.status = :status AND
    // p.type = :type")
    // Double sumTotalRevenue(@Param("status") PaymentStatus status, @Param("type")
    // PaymentType type);

    // // ✅ Thống kê doanh thu theo tháng (Hibernate 6 - dùng EXTRACT thay
    // MONTH/YEAR)
    // @Query(value = """
    // SELECT
    // MONTH(p.timestamp) AS month,
    // YEAR(p.timestamp) AS year,
    // SUM(p.price) AS total
    // FROM payments p
    // WHERE p.status = :status AND p.type = :type
    // GROUP BY YEAR(p.timestamp), MONTH(p.timestamp)
    // ORDER BY YEAR(p.timestamp) DESC, MONTH(p.timestamp) DESC
    // """, nativeQuery = true)
    // List<Object[]> monthlyRevenue(
    // @Param("status") String status,
    // @Param("type") String type
    // );

    // // Mặc định gọi Completed + Final
    // default Double sumTotalRevenueCompletedFinal() {
    // return sumTotalRevenue(PaymentStatus.COMPLETED, PaymentType.FINAL);
    // }

    // default List<Object[]> monthlyRevenueCompletedFinal() {
    // return monthlyRevenue(PaymentStatus.COMPLETED, PaymentType.FINAL);
    // }

    // Optional<Payment> findByTransactionCodeAndUserId(String transactionCode, Long
    // userId);
}
