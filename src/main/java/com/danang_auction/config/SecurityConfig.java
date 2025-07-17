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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ Public routes không cần login
                        .requestMatchers("/api/auth/**", "/api/public/**", "/error").permitAll()

                        // ✅ THÊM: Cho phép tất cả các endpoint /api/home/**
                        .requestMatchers("/api/home/**").permitAll()

                        // ✅ Cho phép gọi GET /api/assets (dành cho search)
                        .requestMatchers(HttpMethod.GET, "/api/assets", "/api/assets/**", "/api/participations").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/sessions/**").permitAll()

                        // ✅ Các request khác yêu cầu đăng nhập
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ SỬA: Thêm nhiều origin và pattern hơn
        configuration.addAllowedOriginPattern("http://localhost:3000");
        configuration.addAllowedOriginPattern("http://127.0.0.1:3000");
        configuration.addAllowedOriginPattern("*"); // Tạm thời cho phép tất cả (chỉ dùng trong development)

        configuration.addAllowedMethod("*"); // GET, POST, PUT, DELETE, OPTIONS
        configuration.addAllowedHeader("*"); // Tất cả header
        configuration.setAllowCredentials(true);

        // ✅ THÊM: Expose headers để frontend có thể đọc
        configuration.addExposedHeader("Authorization");
        configuration.addExposedHeader("Content-Type");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}