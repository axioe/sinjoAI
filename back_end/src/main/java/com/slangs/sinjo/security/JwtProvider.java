package com.slangs.sinjo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {

    /** HS256 서명 키의 최소 길이. 이보다 짧으면 jjwt 가 예외를 던지며 앱이 뜨지 않는다. */
    private static final int MIN_SECRET_BYTES = 32;

    private final SecretKey key;
    private final long expirationMillis;

    public JwtProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expirationMillis
    ) {
        // [추가] 짧은 시크릿을 넣었을 때 원인을 바로 알 수 있게 한다.
        // 이게 없으면 배포 서버에서 JWT_SECRET 을 짧게 넣는 순간
        // "WeakKeyException" 만 뜨고 무엇을 고쳐야 하는지 알기 어렵다.
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < MIN_SECRET_BYTES) {
            throw new IllegalStateException(
                    "app.jwt.secret 이 너무 짧습니다. UTF-8 기준 " + MIN_SECRET_BYTES
                            + "바이트 이상이어야 합니다. (현재 " + secretBytes.length + "바이트)");
        }

        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.expirationMillis = expirationMillis;
    }

    // 로그인 성공 시 토큰 만들기
    public String createToken(Long userId, String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    /**
     * 토큰에서 회원 id 꺼내기.
     *
     * [수정] 예외를 밖으로 던지지 않고 null 을 돌려준다.
     * subject 가 숫자가 아니거나 비어 있으면 Long.valueOf 가
     * NumberFormatException 을 던지는데, 이게 필터 안에서 터지면
     * 사용자에게는 원인 모를 500 이 나간다.
     */
    public Long getUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.valueOf(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    // 유효한 토큰인지 확인
    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
