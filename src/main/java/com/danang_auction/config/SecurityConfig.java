package com.danang_auction.config;

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

import com.danang_auction.security.jwt.JwtAuthenticationFilter;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF vì ta dùng API REST
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không
                                                                                                              // dùng
                                                                                                              // session
                .authorizeHttpRequests(auth -> auth
                        // ✅ Public routes không cần login
                        .requestMatchers("/api/auth/**", "/api/public/**", "/error").permitAll()

                        // ✅ CHỈ CHO BIDDER gọi API nạp tiền
                        .requestMatchers("/api/user/wallet/**").hasAuthority("BIDDER")

                        // ✅ Các API khác của user: cả BIDDER và ORGANIZER đều dùng
                        .requestMatchers("/api/user/**").hasAnyAuthority("BIDDER", "ORGANIZER")

                        // ✅ Cho phép gọi GET /api/assets (dành cho search)
                        .requestMatchers(HttpMethod.GET, "/api/assets", "/api/assets/**", "/api/participations")
                        .permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/sessions/**").permitAll()

                        .requestMatchers("/api/webhooks/**").permitAll() // 👈 Cho phép webhook được truy cập công khai

                        // ✅ Các request khác yêu cầu đăng nhập
                        .requestMatchers(HttpMethod.GET, "/api/home/**").permitAll()
                        .requestMatchers("/favicon.ico", "/images/*.png", "/images/*.jpg").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(withDefaults());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}