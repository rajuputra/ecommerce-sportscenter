package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.ShopUser;
import com.ecommerce.sportscenter.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class AccountService implements UserDetailsService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final EntityManager entityManager;

    public AccountService(UserRepository users, PasswordEncoder encoder, EntityManager entityManager) {
        this.users = users;
        this.encoder = encoder;
        this.entityManager = entityManager;
    }

    public static String normalize(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        var account = users.findById(username).orElseThrow(() -> new UsernameNotFoundException("Account not found"));
        return User.withUsername(account.getUsername()).password(account.getPasswordHash())
                .roles(account.getRole().name()).build();
    }

    @Transactional
    public void register(String username, String email, String password, ShopUser.Role role) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must fit within 72 UTF-8 bytes");
        }
        try {
            // Persist as new so registration cannot replace an existing username.
            entityManager.persist(new ShopUser(normalize(username), normalize(email), encoder.encode(password), role));
            entityManager.flush();
        } catch (ConstraintViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username or email is already registered");
        }
    }
}
