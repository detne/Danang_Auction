package com.danang_auction.controller;

import com.danang_auction.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HomeController {

    private final HomeService homeService;

    // 2. Upcoming assets (tài sản sắp đấu giá)
    @GetMapping("/upcoming-assets")
    public ResponseEntity<?> getUpcomingAssets() {
        try {
            List<Map<String, Object>> assets = homeService.getUpcomingAssets();
            return ResponseEntity.ok(Map.of("success", true, "data", assets));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy dữ liệu tài sản sắp đấu giá: " + e.getMessage()));
        }
    }

    // 3. Ongoing auctions (phiên đấu giá đang diễn ra)
    @GetMapping("/ongoing-auctions")
    public ResponseEntity<?> getOngoingAuctions() {
        try {
            List<Map<String, Object>> ongoingAuctions = homeService.getOngoingAuctions();
            return ResponseEntity.ok(Map.of("success", true, "data", ongoingAuctions));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy dữ liệu phiên đấu giá đang diễn ra: " + e.getMessage()));
        }
    }

    // 4. Past auctions (phiên đấu giá đã kết thúc)
    @GetMapping("/past-auctions")
    public ResponseEntity<?> getPastAuctions() {
        try {
            List<Map<String, Object>> pastAuctions = homeService.getPastAuctions();
            return ResponseEntity.ok(Map.of("success", true, "data", pastAuctions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Lỗi khi lấy dữ liệu: " + e.getMessage()));
        }
    }

    // 5. Featured products (tài sản nổi bật)
    @GetMapping("/featured-products")
    public ResponseEntity<?> getFeaturedProducts() {
        try {
            List<Map<String, Object>> featuredProducts = homeService.getFeaturedProducts();
            return ResponseEntity.ok(Map.of("success", true, "data", featuredProducts));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy dữ liệu tài sản nổi bật: " + e.getMessage()));
        }
    }

    // 6. News section (thông báo)
    @GetMapping("/news")
    public ResponseEntity<?> getNews() {
        try {
            // Tạo dữ liệu thông báo mẫu (có thể tạo bảng news riêng sau)
            List<Map<String, Object>> newsList = List.of(
                    Map.of(
                            "id", 100,
                            "title", "Hướng dẫn tham gia đấu giá tài sản công",
                            "summary", "Chi tiết các bước để người dân tham gia đấu giá tại DaNangAuction. Hướng dẫn đăng ký tài khoản, nộp tiền đặt cọc và tham gia đấu giá trực tuyến.",
                            "publishedAt", LocalDateTime.now().minusDays(1).toString(),
                            "imageUrl", "/images/dang-ky-tham-gia.jpg",
                            "link", "https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/71928/thu-tuc-dau-gia-tai-san-cong-duoc-thuc-hien-theo-hinh-thuc-ban-dau-gia-tu-30-10-2024"
                    ),
                    Map.of(
                            "id", 101,
                            "title", "Thông báo nghỉ lễ 2/9",
                            "summary", "DaNangAuction xin thông báo lịch nghỉ lễ Quốc Khánh năm nay. Hệ thống sẽ tạm ngưng hoạt động từ ngày 2/9 đến 4/9/2024.",
                            "publishedAt", LocalDateTime.now().minusDays(3).toString(),
                            "imageUrl", "/images/news2.jpg"
                    ),
                    Map.of(
                            "id", 102,
                            "title", "Cập nhật chính sách đấu giá mới",
                            "summary", "Từ ngày 1/10/2024, DaNangAuction áp dụng chính sách đấu giá mới với nhiều cải tiến về bảo mật và trải nghiệm người dùng.",
                            "publishedAt", LocalDateTime.now().minusDays(5).toString(),
                            "imageUrl", "/images/news3.jpg"
                    )
            );
            return ResponseEntity.ok(Map.of("success", true, "data", newsList));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy dữ liệu tin tức: " + e.getMessage()));
        }
    }

    // 7. Partners section
    @GetMapping("/partners")
    public ResponseEntity<?> getPartners() {
        try {
            List<Map<String, Object>> partners = List.of(
                    Map.of(
                            "name", "Cục Quản lý công sản", 
                            "logoUrl", "/images/partner1.png", 
                            "website", "https://qlcs.mof.gov.vn",
                            "description", "Cơ quan quản lý nhà nước về tài sản công"
                    ),
                    Map.of(
                            "name", "BIDV Bank", 
                            "logoUrl", "/images/partner2.png", 
                            "website", "https://bidv.com.vn",
                            "description", "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam"
                    ),
                    Map.of(
                            "name", "Vietcombank", 
                            "logoUrl", "/images/partner3.png", 
                            "website", "https://vietcombank.com.vn",
                            "description", "Ngân hàng TMCP Ngoại thương Việt Nam"
                    )
            );
            return ResponseEntity.ok(Map.of("success", true, "data", partners));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy dữ liệu đối tác: " + e.getMessage()));
        }
    }

    // 8. Footer Information
    @GetMapping("/footer")
    public ResponseEntity<?> getFooter() {
        try {
            Map<String, Object> info = Map.of(
                    "company", "Công ty Đấu giá Hợp danh Đà Nẵng",
                    "address", "Số 12 Đường Trần Phú, Hải Châu, Đà Nẵng",
                    "hotline", "0236 123 4567",
                    "email", "support@danangauction.vn",
                    "fanpage", "https://facebook.com/danangauction",
                    "website", "https://danangauction.vn",
                    "workingHours", "Thứ 2 - Thứ 6: 8:00 - 17:00"
            );
            return ResponseEntity.ok(Map.of("success", true, "data", info));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy thông tin footer: " + e.getMessage()));
        }
    }

    // 9. Statistics (thống kê tổng quan)
    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            Map<String, Object> statistics = homeService.getStatistics();
            return ResponseEntity.ok(Map.of("success", true, "data", statistics));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Lỗi khi lấy thống kê: " + e.getMessage()));
        }
    }
}