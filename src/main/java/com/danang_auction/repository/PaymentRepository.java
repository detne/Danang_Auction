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

    // ✅ Tổng doanh thu theo trạng thái và loại thanh toán
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.type = :type")
    Double sumTotalRevenue(@Param("status") PaymentStatus status, @Param("type") PaymentType type);

    // ✅ Thống kê doanh thu theo tháng (native SQL)
    @Query(value = """
        SELECT MONTH(p.timestamp) AS month,
               YEAR(p.timestamp) AS year,
               SUM(p.amount) AS total
        FROM payments p
        WHERE p.status = :status AND p.type = :type
        GROUP BY YEAR(p.timestamp), MONTH(p.timestamp)
        ORDER BY year, month
        """, nativeQuery = true)
    List<Object[]> monthlyRevenue(@Param("status") String status, @Param("type") String type);

    // ✅ Hàm gọi sẵn cho thống kê FINAL + COMPLETED
    default List<Object[]> monthlyRevenueCompletedFinal() {
        return monthlyRevenue("COMPLETED", "FINAL");
    }

    // ✅ Hàm gọi sẵn tổng doanh thu FINAL + COMPLETED
    default Double sumTotalRevenueCompletedFinal() {
        return sumTotalRevenue(PaymentStatus.COMPLETED, PaymentType.FINAL);
    }

    // ✅ Tìm theo mã giao dịch + user
    Optional<Payment> findByTransactionCodeAndUserId(String transactionCode, Long userId);
}