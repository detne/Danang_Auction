package com.danang_auction.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.danang_auction.security.jwt.JwtPayload;

import javax.crypto.SecretKey;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private final String jwtSecret;
    private final long jwtExpirationMs;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(JwtTokenProvider.class);

    public JwtTokenProvider(
            @Value("${app.jwt.secret:danangAuctionSuperSecureKey1234567890_abcd_extraSafe}") String jwtSecret,
            @Value("${app.jwt.expiration:86400000}") long jwtExpirationMs) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("role", role);

        String jti = UUID.randomUUID().toString();
        claims.put("jti", jti);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .setId(jti) // setId chính là jti
                .signWith(getSigningKey())
                .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Long getUserIdFromToken(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    public String getRoleFromToken(String token) {
        return getClaims(token).get("role", String.class);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaims(token).getExpiration();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Invalid JWT: {}", e.getMessage());
            return false;
        }        
    }

    public boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date());
    }

    public Long getCurrentUserId() {
        String authHeader = null;

        // Thử lấy từ SecurityContextHolder
        var context = SecurityContextHolder.getContext();
        if (context != null) {
            var authentication = context.getAuthentication();
            if (authentication != null && authentication.getCredentials() instanceof String) {
                authHeader = (String) authentication.getCredentials();
            }
        }

        // Nếu không thành công, lấy từ header của request
        if (authHeader == null) {
            try {
                ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
                        .getRequestAttributes();
                if (requestAttributes != null) {
                    HttpServletRequest request = requestAttributes.getRequest();
                    authHeader = request.getHeader("Authorization");
                }
            } catch (Exception e) {
                // Bỏ qua nếu không lấy được request
            }
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Loại bỏ "Bearer "
            if (validateToken(token)) {
                return getUserIdFromToken(token);
            }
        }
        return null;
    }

    public String getJtiFromToken(String token) {
        return getClaims(token).getId();
    }

    public JwtPayload decodePayload(String token) {
        Claims claims = getClaims(token);
        JwtPayload payload = new JwtPayload();
        payload.setSub(getUserIdFromToken(token));
        payload.setJti(getJtiFromToken(token));
        payload.setIat(claims.getIssuedAt() != null ? claims.getIssuedAt().getTime() / 1000 : null);
        payload.setExp(claims.getExpiration() != null ? claims.getExpiration().getTime() / 1000 : null);
        return payload;
    }

    public Claims getAllClaimsFromToken(String token) {
        return getClaims(token);
    }    
}