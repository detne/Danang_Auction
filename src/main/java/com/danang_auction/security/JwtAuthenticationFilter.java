package com.danang_auction.security;

import com.danang_auction.model.entity.User;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j // Thêm log
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtTokenProvider.validateToken(token)) {
                    Long userId = jwtTokenProvider.getUserIdFromToken(token);
                    User user = userRepository.findById(userId).orElse(null);

                    if (user != null) {
                        CustomUserDetails userDetails = new CustomUserDetails(
                                user.getId(),
                                user.getUsername(),
                                user.getPassword(),
                                user.getRole() // Giả sử role là enum hoặc string
                        );

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.info("User authenticated: {}", user.getUsername());
                    } else {
                        log.warn("User not found for userId: {}", userId);
                    }
                } else {
                    log.warn("Invalid or expired token: {}", token);
                }
            } catch (Exception e) {
                log.error("Error processing token: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}