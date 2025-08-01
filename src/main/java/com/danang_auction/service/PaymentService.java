package com.danang_auction.service;

import com.danang_auction.model.dto.payment.PaymentHistoryDTO;
import com.danang_auction.model.dto.webhook.SepayWebhookPayload;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.repository.PaymentRepository;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final AuctionSessionParticipantRepository participantRepository;
    private final EmailService emailService;
    // ✅ Tạo bản ghi PENDING nếu chưa có
    @Transactional
    public boolean processSepayWebhook(SepayWebhookPayload payload) {
        if (!"in".equalsIgnoreCase(payload.getTransferType())) {
            log.info("📤 Bỏ qua giao dịch không phải chuyển vào");
            return false;
        }

        String description = payload.getDescription();
        log.info("📜 Webhook description: {}", description);

        Long userId = extractUserIdFromDescription(description);
        if (userId == null) {
            log.error("❌ Không tìm được userId trong description: {}", description);
            return false;
        }

        // Check duplicate referenceCode
        Optional<Payment> alreadyDone = paymentRepository.findByReferenceCode(payload.getReferenceCode());
        if (alreadyDone.isPresent()) {
            log.warn("⚠️ Giao dịch đã xử lý trước đó: {}", payload.getReferenceCode());
            return false;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ Không tìm thấy user ID: " + userId));

        LocalDateTime parsedTimestamp = LocalDateTime.parse(
                payload.getTransactionDate(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Tìm pending payment nếu có
        Optional<Payment> pending = paymentRepository
                .findFirstByUserIdAndAmountAndStatus(userId, payload.getTransferAmount().doubleValue(),
                        PaymentStatus.PENDING);

        Payment payment = pending.orElseGet(Payment::new);
        payment.setUser(user);
        payment.setAmount(payload.getTransferAmount().doubleValue());
        payment.setReferenceCode(payload.getReferenceCode());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setType(PaymentType.DEPOSIT);
        payment.setTransactionCode("SEPAY_" + payload.getId());
        payment.setNote("Nạp tiền qua SePay");
        payment.setTimestamp(parsedTimestamp);

        paymentRepository.save(payment);

        // ✅ Cộng tiền vào user balance
        user.setBalance(user.getBalance() + payment.getAmount());
        userRepository.save(user);

        log.info("✅ Nạp tiền thành công: +{}đ cho userId={} - username={}",
                payment.getAmount(), user.getId(), user.getUsername());

        // ✅ Check các phiên user đang WINNER chưa thanh toán
        List<AuctionSessionParticipant> unpaidWinners = participantRepository.findByUserIdAndStatusAndPaymentStatus(
                user.getId(),
                ParticipantStatus.WINNER,
                PaymentStatus.UNPAID);

        for (AuctionSessionParticipant p : unpaidWinners) {
            if (user.getBalance() >= p.getFinalPrice()) {
                // Tự động trừ tiền và đánh dấu thanh toán
                user.setBalance(user.getBalance() - p.getFinalPrice());
                p.setPaymentStatus(PaymentStatus.PAID);
                p.setPaidAt(LocalDateTime.now());

                userRepository.save(user);
                participantRepository.save(p);

                log.info("💰 User {} đã tự động thanh toán {}đ cho phiên {}",
                        user.getUsername(), p.getFinalPrice(), p.getAuctionSession().getId());

                emailService.sendAuctionWinnerPaymentSuccess(
                        user.getEmail(),
                        p.getAuctionSession().getTitle());
            }
        }

        return true;
    }

    /**
     * ✅ Trích userId từ description dạng DANANGAUCTIONUSER{userId}
     */
    private Long extractUserIdFromDescription(String description) {
        if (description == null || description.trim().isEmpty())
            return null;

        Pattern pattern = Pattern.compile("DANANGAUCTIONUSER(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(description.trim());

        if (matcher.find()) {
            return Long.valueOf(matcher.group(1));
        }

        log.error("❌ Không thể parse userId từ description: {}", description);
        return null;
    }

    /**
     * ✅ Tạo payment pending khi user yêu cầu nạp
     */
    @Transactional
    public void createPendingPayment(Long userId, double amount, String content) {
        // Nếu chưa có pending với cùng user + amount
        Optional<Payment> pending = paymentRepository
                .findFirstByUserIdAndAmountAndStatus(userId, amount, PaymentStatus.PENDING);

        if (pending.isPresent()) {
            log.info("⚠️ Đã có payment PENDING cho userId={} amount={}", userId, amount);
            return;
        }

        Payment payment = new Payment();
        payment.setUser(userRepository.getReferenceById(userId));
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setType(PaymentType.DEPOSIT);
        payment.setTransactionCode("SEPAY_" + content);
        payment.setNote("Chờ người dùng chuyển khoản");
        payment.setTimestamp(LocalDateTime.now());

        paymentRepository.save(payment);
    }

    public List<PaymentHistoryDTO> getMyPaymentHistory(Long userId) {
        return paymentRepository.findAllByUserId(userId).stream()
                .map(payment -> {
                    PaymentHistoryDTO dto = new PaymentHistoryDTO();
                    dto.setId(payment.getId().longValue());
                    dto.setAmount(payment.getAmount());
                    dto.setType(payment.getType());
                    dto.setStatus(payment.getStatus());
                    dto.setCreatedAt(payment.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Long getBalanceByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với ID: " + userId));
        Double balance = user.getBalance();
        return balance == null ? 0L : balance.longValue();
    }
}
