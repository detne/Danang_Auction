package com.danang_auction.config;

import com.danang_auction.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

                        // ✅ Tất cả các request khác yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                // ✅ Thêm filter JWT trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Sử dụng BCrypt để mã hóa mật khẩu
    }
}