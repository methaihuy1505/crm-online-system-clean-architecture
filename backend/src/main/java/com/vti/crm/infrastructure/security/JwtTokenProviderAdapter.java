package com.vti.crm.infrastructure.security;

import com.vti.crm.application.ports.ITokenProvider;
import com.vti.crm.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProviderAdapter implements ITokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public String generateToken(User user, List<String> permissions) { // <--- Thêm tham số ở đây
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("username", user.getUsername())
                .claim("roleId", user.getRoleId())
                .claim("permissions", permissions) // <--- NHÉT QUYỀN VÀO PAYLOAD CỦA TOKEN
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Integer getUserIdFromJwt(String token) {
        Claims claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        return Integer.parseInt(claims.getSubject());
    }

    // THÊM HÀM MỚI: Bóc mảng quyền từ Token ra
    public List<String> getPermissionsFromJwt(String token) {
        Claims claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        return claims.get("permissions", List.class);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}