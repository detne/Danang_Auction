# Danang Auction Platform 🎯

Hệ thống quản lý đấu giá trực tuyến tại thành phố Đà Nẵng, được xây dựng bằng Spring Boot, hướng đến việc cung cấp một nền tảng hiện đại, bảo mật và thân thiện với người dùng cho hoạt động đấu giá tài sản công và tư.

---

## 🔧 Công nghệ sử dụng

- Java 17
- Spring Boot
- Spring Security (JWT + Google OAuth2)
- Spring Data JPA (MySQL)
- WebSocket (Real-time bidding)
- Spring Mail (Mailtrap / SMTP)
- Bean Validation
- Maven
- IntelliJ IDEA

---

## 📁 Cấu trúc thư mục

```
src/
├── main/java/com/danangauction/
│   ├── config/         # Cấu hình JWT, OAuth2, Security
│   ├── controller/     # REST API
│   ├── dto/            # Request & Response DTOs
│   ├── entity/         # JPA Entities
│   ├── repository/     # JpaRepository
│   ├── service/        # Business Logic
│   ├── exception/      # Exception Handler
│   └── util/           # JWT Utilities, Email Helpers,...
├── resources/
│   ├── application.properties
│   ├── static/
│   └── templates/
├── test/
├── pom.xml
└── README.md
```

---

## 🚀 Hướng dẫn chạy dự án

### 1. Clone dự án

```bash
git clone https://github.com/detne/Danang_Auction.git
cd Danang_Auction
```

### 2. Cấu hình MySQL

Tạo database tên `auctiondb` và cấu hình trong file:

```
src/main/resources/application.properties
```

### 3. Chạy ứng dụng

```bash
./mvnw spring-boot:run
```

Ứng dụng mặc định chạy tại: [http://localhost:8080](http://localhost:8080)

---

## 📌 Mục tiêu dự án

- Đăng ký, đăng nhập người dùng (JWT hoặc Google)
- Quản lý tài sản đấu giá
- Tổ chức & tham gia phiên đấu giá
- Đặt giá theo thời gian thực bằng WebSocket
- Xác nhận thanh toán và gửi email OTP

---

## 🧑‍💻 Đóng góp

Chào đón mọi đóng góp thông qua pull request và issues.

---

## 📄 License

Dự án phát triển nội bộ, chưa công khai license. Vui lòng liên hệ để biết thêm chi tiết.
