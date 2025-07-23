package com.danang_auction.config;

import com.danang_auction.model.entity.*;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public void run(String... args) {
        if (userRepo.count() > 0)
            return;

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
        userRepo.save(admin);

        User organizer = new User();
        organizer.setUsername("organizer1");
        organizer.setPassword(passwordEncoder.encode("NewPass123")); // Cập nhật mật khẩu theo phản hồi đăng nhập thành
                                                                     // công
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
        userRepo.save(organizer);

        // 2. CATEGORIES
        categoryRepo.deleteAll();

        String[][] categories = {
                { "Bất động sản", "Đất, nhà, căn hộ" },
                { "Xe cộ", "Ô tô, xe máy, xe tải" },
                { "Thiết bị văn phòng", "Thiết bị sử dụng cho văn phòng" },
                { "Máy móc", "Máy móc, thiết bị sản xuất" },
                { "Khác", "Loại tài sản khác" }
        };

        List<Category> categoryList = new ArrayList<>();
        for (String[] cat : categories) {
            Category category = new Category();
            category.setName(cat[0]);
            category.setDescription(cat[1]);
            category.setCreatedAt(LocalDateTime.now());
            category.setUpdatedAt(LocalDateTime.now());
            categoryRepo.save(category);
            categoryList.add(category); // Lưu vào list để dùng sau
        }

        // 3. AUCTION SESSIONS
        AuctionSession s1 = new AuctionSession();
        s1.setSessionCode("SESS001");
        s1.setTitle("Đấu giá nhà đất tháng 6");
        s1.setDescription("Phiên đấu giá tài sản bất động sản");
        s1.setStatus(AuctionSessionStatus.APPROVED);
        s1.setStartTime(LocalDateTime.of(2025, 6, 15, 9, 0));
        s1.setOrganizer(organizer);
        s1.setCategory(categoryList.get(0)); // "Bất động sản"
        s1.setEndTime(LocalDateTime.of(2025, 6, 15, 12, 0));
        sessionRepo.save(s1);

        AuctionSession s2 = new AuctionSession();
        s2.setSessionCode("SESS002");
        s2.setTitle("Đấu giá xe tháng 7");
        s2.setDescription("Phiên đấu giá các loại phương tiện");
        s2.setStatus(AuctionSessionStatus.UPCOMING);
        s2.setStartTime(LocalDateTime.of(2025, 7, 1, 9, 0));
        s2.setOrganizer(organizer);
        s2.setCategory(categoryList.get(1)); // "Xe cộ"
        s2.setEndTime(LocalDateTime.of(2025, 7, 1, 12, 0));
        sessionRepo.save(s2);

        // 4. DOCUMENTS
        AuctionDocument doc1 = new AuctionDocument();
        doc1.setDocumentCode("DOC001");
        doc1.setUser(organizer);
        doc1.setSession(s1);
        doc1.setCategory(categoryList.get(0)); // "Bất động sản"
        doc1.setDescription("Nhà 3 tầng mặt tiền Lê Duẩn, Đà Nẵng");
        doc1.setDepositAmount(5000000.0);
        doc1.setIsDepositRequired(true);
        doc1.setStatus(AuctionDocumentStatus.APPROVED);
        doc1.setAuctionType(AuctionType.PUBLIC);
        doc1.setStartingPrice(1000000000.0);
        doc1.setStepPrice(50000000.0);
        doc1.setRegisteredAt(LocalDateTime.now());
        doc1.setStartTime(LocalDateTime.of(2025, 6, 15, 9, 0));
        doc1.setEndTime(LocalDateTime.of(2025, 6, 15, 12, 0));
        documentRepo.save(doc1);

        // 5. PARTICIPANT
        AuctionSessionParticipant part = new AuctionSessionParticipant();
        part.setUser(admin);
        part.setAuctionSession(s1);
        part.setRole("PARTICIPANT");
        part.setStatus(ParticipantStatus.APPROVED);
        part.setDepositStatus(DepositStatus.PAID);
        part.setRegisteredAt(LocalDateTime.now());
        participantRepo.save(part);

        // 6. PAYMENTS
        Payment p1 = new Payment();
        p1.setType(PaymentType.DEPOSIT);
        p1.setStatus(PaymentStatus.COMPLETED);
        p1.setPrice(5000000.0);
        p1.setTimestamp(LocalDateTime.now());
        p1.setUser(organizer);
        p1.setSession(s1);
        paymentRepo.save(p1);

        Payment p2 = new Payment();
        p2.setType(PaymentType.FINAL);
        p2.setStatus(PaymentStatus.PENDING);
        p2.setPrice(1050000000.0);
        p2.setTimestamp(LocalDateTime.now());
        p2.setUser(organizer);
        p2.setSession(s1);
        paymentRepo.save(p2);

        // 7. BIDS
        AuctionBid b1 = new AuctionBid();
        b1.setPrice(1050000000.0);
        b1.setTimestamp(LocalDateTime.now());
        b1.setUser(organizer);
        b1.setSession(s1);
        bidRepo.save(b1);

        AuctionBid b2 = new AuctionBid();
        b2.setPrice(1100000000.0);
        b2.setTimestamp(LocalDateTime.now());
        b2.setUser(organizer);
        b2.setSession(s1);
        bidRepo.save(b2);

        // 8. IMAGES
        Image img1 = new Image();
        img1.setUrl("https://res.cloudinary.com/demo/image/upload/v123456/house1.jpg");
        img1.setPublicId("house1_public_id");
        img1.setType("asset");
        img1.setSize(204800);
        img1.setCreatedAt(LocalDateTime.now());
        img1.setUpdatedAt(LocalDateTime.now());
        imageRepo.save(img1);

        Image img2 = new Image();
        img2.setUrl("https://res.cloudinary.com/demo/image/upload/v123456/auction_banner.jpg");
        img2.setPublicId("auction_banner");
        img2.setType("auction");
        img2.setSize(102400);
        img2.setCreatedAt(LocalDateTime.now());
        img2.setUpdatedAt(LocalDateTime.now());
        imageRepo.save(img2);

        // 9. IMAGE RELATION
        ImageRelation rel1 = new ImageRelation(img1, doc1, ImageRelationType.ASSET);
        imageRelationRepo.save(rel1);

        ImageRelation rel2 = new ImageRelation(img2, doc1, ImageRelationType.AUCTION);
        imageRelationRepo.save(rel2);
    }
}