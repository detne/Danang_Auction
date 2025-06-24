package com.danang_auction.service;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.AuctionBidRepository;
import com.danang_auction.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AuctionSessionRepository auctionSessionRepository;

    @Autowired
    private AuctionBidRepository auctionBidRepository;

    public Payment createPayment(Long userId, Long sessionId, String transactionCode, Double amount, String paymentMethod) {
        // 1. Kiểm tra phiên đấu giá và lấy thông tin phiên đấu giá
        AuctionSession auctionSession = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalStateException("Phiên đấu giá không tồn tại."));

        // 2. Tìm người thắng cuộc (phiếu đấu giá cao nhất)
        AuctionBid winningBid = auctionBidRepository.findTopBySessionOrderByPriceDesc(auctionSession)
                .orElseThrow(() -> new IllegalStateException("Không có phiếu đấu giá nào cho phiên này."));

        // 3. Kiểm tra người thắng cuộc
        if (!winningBid.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Bạn không phải là người thắng phiên này.");
        }

        // 4. Kiểm tra thanh toán đã có
        Payment existingPayment = paymentRepository.findBySessionIdAndStatus(sessionId, PaymentStatus.PENDING);
        if (existingPayment != null) {
            throw new IllegalStateException("Đã có thanh toán pending cho phiên này.");
        }

        // 5. Tạo thanh toán mới
        Payment payment = new Payment();
        payment.setSession(auctionSession);
        payment.setUser(winningBid.getUser());  // Người thắng cuộc
        payment.setType(PaymentType.FINAL);  // Thanh toán cuối cùng
        payment.setPrice(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTimestamp(LocalDateTime.now());

        // Lưu thanh toán vào cơ sở dữ liệu
        return paymentRepository.save(payment);
    }
}
