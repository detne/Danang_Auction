package com.danang_auction.config;

import com.danang_auction.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;  // Import SessionCreationPolicy

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF vì sử dụng JWT và API RESTful
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không sử dụng session, chỉ dựa vào token
                .authorizeHttpRequests(auth -> auth
                        // ✅ Các route công khai không cần login
                        .requestMatchers("/api/auth/**", "/api/public/**", "/error").permitAll()

                        // ✅ Cho phép GET request cho các endpoint tìm kiếm tài sản
                        .requestMatchers(HttpMethod.GET, "/api/assets", "/api/assets/**", "/api/participations").permitAll()

                        // ✅ Cho phép PUT /api/admin/assets/{id}/approve để test
                        .requestMatchers(HttpMethod.PUT, "/api/admin/assets/{id}/approve").permitAll()

                        // ✅ Cho phép tất cả người dùng truy cập vào /api/admin/deposits mà không cần token hay quyền admin
                        .requestMatchers("/api/admin/deposits").permitAll()  // Đảm bảo đường dẫn này không yêu cầu xác thực

                        // ✅ Tất cả các request khác yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Thêm filter JWT trước khi xác thực người dùng

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Sử dụng BCrypt để mã hóa mật khẩu
    }
}
