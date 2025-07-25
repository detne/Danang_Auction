package com.danang_auction.security.jwt;

import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.UserStatus;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.data.redis.core.RedisTemplate;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtTokenProvider.validateToken(token)) {
                // Lấy claims từ token
                var claims = jwtTokenProvider.getAllClaimsFromToken(token);

                // KIỂM TRA BLACKLIST QUA REDIS
                String jti = claims.getId();
                String revoked = redisTemplate.opsForValue().get(jti); // <-- dùng redisTemplate, không dùng cacheManager!
                if ("revoked".equals(revoked)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter()
                            .write("{\"success\":false,\"message\":\"Token đã bị thu hồi, vui lòng đăng nhập lại\"}");
                    return;
                }

                Long userId = jwtTokenProvider.getUserIdFromToken(token);
                User user = userRepository.findById(userId).orElse(null);

                if (user != null && user.getStatus() == UserStatus.ACTIVE) {
                    CustomUserDetails userDetails = new CustomUserDetails(
                            user.getId(),
                            user.getUsername(),
                            user.getPassword(),
                            user.getRole());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // ❌ Trạng thái không hợp lệ
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Tài khoản bị cấm hoặc bị tạm khóa.");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}