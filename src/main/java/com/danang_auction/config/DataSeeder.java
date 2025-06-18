package com.danang_auction.config;

import com.danang_auction.model.entity.*;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final AuctionSessionRepository sessionRepo;
    private final AuctionDocumentRepository documentRepo;
    private final AuctionSessionParticipantRepository participantRepo;
    private final PaymentRepository paymentRepo;
    private final AuctionBidRepository bidRepo;
    private final ImageRepository imageRepo;
    private final ImageRelationRepository imageRelationRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        // 1. USERS
        User admin = new User();
        admin.setUsername("adminUser");
        admin.setPassword(passwordEncoder.encode("AdminPass123"));
        admin.setEmail("admin@example.com");
        admin.setPhoneNumber("0123456789");
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setGender(Gender.MALE);
        admin.setDob(LocalDate.of(1990, 1, 1));
        admin.setProvince("Đà Nẵng");
        admin.setDistrict("Hải Châu");
        admin.setWard("Phước Ninh");
        admin.setDetailedAddress("123 Lê Duẩn");
        admin.setIdentityNumber("123456789");
        admin.setIdentityIssueDate(LocalDate.of(2010, 1, 1));
        admin.setIdentityIssuePlace("Công an Đà Nẵng");
        admin.setBankAccountNumber("1234567890");
        admin.setBankName("Vietcombank");
        admin.setBankAccountHolder("Admin User");
        admin.setAccountType(AccountType.PERSONAL);
        admin.setRole(UserRole.ADMIN);
        admin.setVerified(true);
        admin.setStatus(UserStatus.ACTIVE);
        admin.setIdentityFrontUrl("http://image.front.cccd");
        admin.setIdentityBackUrl("http://image.back.cccd");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        User organizer = new User();
        organizer.setUsername("organizer1");
        organizer.setPassword(passwordEncoder.encode("OrganizerPass123"));
        organizer.setEmail("org1@example.com");
        organizer.setPhoneNumber("0987654321");
        organizer.setFirstName("Thanh");
        organizer.setLastName("Huy");
        organizer.setGender(Gender.MALE);
        organizer.setDob(LocalDate.of(1995, 5, 5));
        organizer.setProvince("Đà Nẵng");
        organizer.setDistrict("Thanh Khê");
        organizer.setWard("Xuân Hà");
        organizer.setDetailedAddress("456 Nguyễn Tất Thành");
        organizer.setIdentityNumber("987654321");
        organizer.setIdentityIssueDate(LocalDate.of(2015, 3, 15));
        organizer.setIdentityIssuePlace("Công an TP.HCM");
        organizer.setBankAccountNumber("2345678901");
        organizer.setBankName("ACB");
        organizer.setBankAccountHolder("Thanh Huy");
        organizer.setAccountType(AccountType.ORGANIZATION);
        organizer.setRole(UserRole.ORGANIZER);
        organizer.setVerified(false);
        organizer.setStatus(UserStatus.ACTIVE);
        organizer.setCreatedAt(LocalDateTime.now());
        organizer.setUpdatedAt(LocalDateTime.now());

        userRepo.saveAll(List.of(admin, organizer));

        // 2. CATEGORIES
        Category cat1 = new Category(null, "Bất động sản", "Đất, nhà, căn hộ", LocalDateTime.now(), LocalDateTime.now());
        Category cat2 = new Category(null, "Phương tiện", "Ô tô, xe máy, xe tải", LocalDateTime.now(), LocalDateTime.now());
        Category cat3 = new Category(null, "Điện tử", "Điện thoại, laptop, thiết bị công nghệ", LocalDateTime.now(), LocalDateTime.now());
        categoryRepo.saveAll(List.of(cat1, cat2, cat3));

        // 3. AUCTION SESSIONS
        AuctionSession s1 = new AuctionSession(null, "SESS001", "Đấu giá nhà đất tháng 6", "Phiên đấu giá tài sản bất động sản",
                AuctionSessionStatus.ACTIVE, null, LocalDateTime.now(), LocalDateTime.now(), organizer);
        AuctionSession s2 = new AuctionSession(null, "SESS002", "Đấu giá xe tháng 7", "Phiên đấu giá các loại phương tiện",
                AuctionSessionStatus.UPCOMING, null, LocalDateTime.now(), LocalDateTime.now(), organizer);

        sessionRepo.saveAll(List.of(s1, s2));

        // 4. DOCUMENTS
        AuctionDocument doc1 = new AuctionDocument(null, "DOC001", organizer, s1, cat1,
                "Nhà 3 tầng mặt tiền Lê Duẩn, Đà Nẵng",
                5000000.0, true, AuctionDocumentStatus.APPROVED, AuctionType.PUBLIC,
                1000000000.0, 50000000.0, LocalDateTime.now(),
                LocalDateTime.of(2025, 6, 15, 9, 0),
                LocalDateTime.of(2025, 6, 15, 12, 0),
                LocalDateTime.now(), LocalDateTime.now());
        documentRepo.save(doc1);

        // 5. PARTICIPANT
        AuctionSessionParticipant part = new AuctionSessionParticipant(
                organizer, s1, "bidder", ParticipantStatus.APPROVED,
                DepositStatus.PAID, LocalDateTime.now(), LocalDateTime.now());
        participantRepo.save(part);

        // 6. PAYMENTS
        Payment p1 = new Payment(null, PaymentType.DEPOSIT, PaymentStatus.COMPLETED, 5000000.0,
                LocalDateTime.now(), organizer, s1);
        Payment p2 = new Payment(null, PaymentType.FINAL, PaymentStatus.PENDING, 1050000000.0,
                LocalDateTime.now(), organizer, s1);
        paymentRepo.saveAll(List.of(p1, p2));

        // 7. BIDS
        AuctionBid b1 = new AuctionBid(null, 1050000000.0, LocalDateTime.now(), organizer, s1);
        AuctionBid b2 = new AuctionBid(null, 1100000000.0, LocalDateTime.now(), organizer, s1);
        bidRepo.saveAll(List.of(b1, b2));

        // 8. IMAGES
        Image img1 = new Image(null, "https://res.cloudinary.com/demo/image/upload/v123456/house1.jpg",
                "house1_public_id", "asset", 204800, LocalDateTime.now(), LocalDateTime.now());
        Image img2 = new Image(null, "https://res.cloudinary.com/demo/image/upload/v123456/auction_banner.jpg",
                "auction_banner", "auction", 102400, LocalDateTime.now(), LocalDateTime.now());
        imageRepo.saveAll(List.of(img1, img2));
        imageRepo.flush();

        // 9. IMAGE RELATION
        ImageRelation rel1 = new ImageRelation(img1, doc1.getId().longValue(), ImageRelationType.ASSET);
        ImageRelation rel2 = new ImageRelation(img2, doc1.getId().longValue(), ImageRelationType.AUCTION);
        imageRelationRepo.saveAll(List.of(rel1, rel2));
    }
}
