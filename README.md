# 🏛️ Danang Auction System

**Danang Auction System** là một nền tảng đấu giá trực tuyến hỗ trợ đấu giá tài sản công và tư tại thành phố Đà Nẵng. Hệ thống được xây dựng bằng **Java Spring Boot**, **MySQL**, và tuân theo kiến trúc RESTful hiện đại.

---

## 🚀 Tính năng chính

- Đăng ký / Đăng nhập người dùng bằng tài khoản hoặc Google OAuth2
- Phân quyền: Admin, Tổ chức đấu giá (Organizer), Người tham gia (Bidder)
- Quản lý tài sản đấu giá và hình ảnh kèm theo
- Tạo và duyệt phiên đấu giá (Auction Sessions)
- Đăng ký tham gia phiên, nộp tiền cọc
- Đấu giá trực tuyến thời gian thực qua WebSocket
- Quản lý thanh toán và hoàn tiền
- Xác minh giấy tờ CCCD qua hệ thống kiểm duyệt
- Quản trị hệ thống bởi Admin

---

## 🧰 Công nghệ sử dụng

| Thành phần          | Công nghệ                         |
|---------------------|-----------------------------------|
| Backend             | Spring Boot, Spring Security      |
| ORM                 | Hibernate, Spring Data JPA        |
| Cơ sở dữ liệu       | MySQL                             |
| API Auth            | JWT, Google OAuth2                |
| Real-time Auction   | Spring WebSocket (STOMP)          |
| Image Upload        | Cloudinary, Multer                |
| Email OTP           | Mailtrap (SMTP API)               |
| API Test            | Postman Collection                |
| Redis               | NoSQL database                    |

---

## 🗂️ Cấu trúc thư mục chính

```bash
├── src
│   ├── main
│   │   ├── java/com/danang_auction
│   │   │   ├── controller        # REST Controllers
│   │   │   ├── dto               # DTO classes
│   │   │   ├── entity            # Hibernate Entities
│   │   │   ├── enums             # Enum types (role, status...)
│   │   │   ├── repository        # JPA Repositories
│   │   │   ├── service           # Business logic services
│   │   │   ├── security          # JWT, filters, configs
│   │   │   └── utils             # AES utils, Email, etc
│   └── resources
│       ├── application.properties
│       └── static / templates
├── test/...
└── README.md


---

## ⚙️ Cấu hình môi trường

Tạo file `application.properties` và thêm các cấu hình sau:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/danang_auction?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate / JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT
app.jwt.secret=danangAuctionSecretKey123456789abcdefghijklmnopqrstuvwxyz
app.jwt.expiration=86400000

# AES
app.encryption.key=MySecretKey12345

# Server
server.port=8080
server.servlet.context-path=/

# ? Logging
logging.level.com.danang_auction=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.flywaydb=DEBUG

## 🧪 Hướng dẫn chạy & test

### Clone project

```bash
git clone https://github.com/your-org/danang-auction.git
cd danang-auction
```

### Tạo schema MySQL

```sql
CREATE DATABASE danang_auction;
```

### Chạy Flyway migration

```bash
./mvnw flyway:migrate
```

### Khởi động ứng dụng

```bash
./mvnw spring-boot:run
```

### Truy cập

* Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
* Postman collection: `./postman/auction-system-collection.json`

---

## 🛡️ Phân quyền hệ thống

| Role      | Mô tả quyền                                                    |
| --------- | -------------------------------------------------------------- |
| Admin     | Toàn quyền hệ thống: duyệt tài sản, duyệt phiên, xác minh CCCD |
| Organizer | Tạo tài sản và phiên đấu giá, xem người tham gia               |
| Bidder    | Đăng ký phiên, nộp tiền cọc, đấu giá, thanh toán               |

---
## Hướng dẫn tạo nhánh mới khi phát triển API

Để đảm bảo đồng nhất khi phát triển chức năng mới, vui lòng tuân thủ quy trình tạo nhánh như sau:

###  Các bước tạo nhánh:

1.  **Tạo một nhánh mới từ local** với tên mô tả đúng chức năng bạn đang làm:

```bash
git checkout -b feature/<ten-nhanh>
```

   Ví dụ: nếu bạn đang làm tính năng reset password, hãy đặt tên nhánh là `feature/apiResetPassword`.

   **Lưu ý:** Tên nhánh nên bắt đầu bằng `feature/`, `bugfix/`, hoặc `hotfix/` tùy theo loại thay đổi.

2.  **Luôn pull nhánh `main` mới nhất trước khi bắt đầu code**:

```bash
git pull origin main
```

   Điều này giúp bạn đảm bảo rằng bạn đang làm việc trên phiên bản mới nhất của mã nguồn và tránh xung đột khi push lên sau này.

   Nếu có xung đột, hãy giải quyết chúng trước khi tiếp tục.

   **Lưu ý:** Nếu bạn đã có nhánh `main` cũ, hãy chắc chắn cập nhật nó bằng lệnh:


3.  **Bắt đầu code**, đảm bảo bạn:

    -   Tạo file `.env` (nếu cần) dựa theo mẫu có sẵn trong `main` là `.env.example`.

    -   **Tuyệt đối không được push file `.env` lên GitHub** – file này đã được `.gitignore`.


Ví dụ:

`git checkout -b feature/apiResetPassword
git pull origin main # -> Bắt đầu code tính năng reset password`

## 📌 Ghi chú đặc biệt

* CCCD phải upload mặt trước và mặt sau, hệ thống tự phân loại.
* Mỗi tài sản chỉ được đấu giá sau khi Admin phê duyệt.
* Một phiên chỉ bắt đầu khi đến giờ và trạng thái là `SCHEDULED`.
* Thanh toán và hoàn tiền yêu cầu trạng thái đúng mới xử lý được.

---

## 📧 Liên hệ

> **Project by:** Danang Auction Team
> 
> **Email:** [support@danangauction.vn](mailto:support@danangauction.vn)
> 
> **Website:** [https://danangauction.vn](https://danangauction.vn)



