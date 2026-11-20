package com.ecommerce.sportscenter.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtHelper {
    private final SecretKey key;

    public JwtHelper(@Value("${app.jwt-secret:}") String secret,
                     @Value("${app.require-persistent-secret:false}") boolean requirePersistentSecret) {
        if (secret.isBlank() && requirePersistentSecret) {
            throw new IllegalStateException("APP_JWT_SECRET must be configured");
        }
        key = secret.isBlank() ? Keys.secretKeyFor(SignatureAlgorithm.HS256)
                : Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String subject(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String issue(String username) {
        Instant now = Instant.now();
        return Jwts.builder().setSubject(username).setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(18_000))).signWith(key).compact();
    }
}
