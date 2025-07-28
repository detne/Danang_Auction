package com.danang_auction.service;

import com.danang_auction.model.dto.payment.PaymentHistoryDTO;
import com.danang_auction.model.dto.webhook.SepayWebhookPayload;
import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.repository.PaymentRepository;
import com.danang_auction.repository.UserRepository;
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

    // ✅ Tạo bản ghi PENDING nếu chưa có
    @Transactional
    public void createPendingPayment(Long userId, Double amount, String transactionCode) {
        Optional<Payment> existing = paymentRepository
                .findFirstByUserIdAndAmountAndStatus(userId, amount, PaymentStatus.PENDING);

        if (existing.isPresent()) {
            log.info("⚠️ Đã tồn tại payment PENDING cho user {}, amount {}", userId, amount);
            return;
        }

        Payment payment = new Payment();
        payment.setUser(userRepository.findById(userId).orElseThrow());
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setType(PaymentType.DEPOSIT);
        payment.setTransactionCode("SEPAY_" + transactionCode);
        payment.setNote("Chờ người dùng chuyển khoản");
        payment.setTimestamp(LocalDateTime.now());

        paymentRepository.save(payment);
        log.info("📌 Tạo payment PENDING thành công cho userId {}", userId);
    }

    // ✅ Xử lý webhook SePay → cập nhật PENDING hoặc tạo mới
    @Transactional
    public void processSepayWebhook(SepayWebhookPayload payload) {
        if (!"in".equalsIgnoreCase(payload.getTransferType())) {
            log.info("📤 Bỏ qua giao dịch không phải chuyển vào");
            return;
        }

        String description = payload.getDescription();
        log.info("📜 Webhook description: {}", description);

        Long userId = extractUserIdFromDescription(description);
        log.info("🧪 Extracted userId = {}", userId);

        if (userId == null) {
            log.error("❌ Không tìm được userId trong description: {}", description);
            return;
        }

        Optional<Payment> alreadyDone = paymentRepository.findByReferenceCode(payload.getReferenceCode());
        if (alreadyDone.isPresent()) {
            log.warn("⚠️ Giao dịch đã xử lý trước đó: {}", payload.getReferenceCode());
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ Không tìm thấy user ID: " + userId));

        LocalDateTime parsedTimestamp = LocalDateTime.parse(
                payload.getTransactionDate(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

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

        // ✅ Cộng tiền
        user.setBalance(user.getBalance() + payment.getAmount());
        userRepository.save(user);

        log.info("✅ Nạp tiền thành công: +{}đ cho userId={} - username={}",
                payment.getAmount(), user.getId(), user.getUsername());
    }

    // ✅ Trích userId từ description dạng 10000{userId}
    private Long extractUserIdFromDescription(String description) {
        if (description == null || description.trim().isEmpty())
            return null;

        Pattern pattern = Pattern.compile("DANANGAUCTIONUSER(\\d+)");
        Matcher matcher = pattern.matcher(description.trim());

        if (matcher.find()) {
            return Long.valueOf(matcher.group(1));
        }

        log.error("❌ Không thể parse userId từ description: {}", description);
        return null;
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
