package com.ecommerce.sportscenter.config;

import com.ecommerce.sportscenter.entity.ShopUser;
import com.ecommerce.sportscenter.repository.UserRepository;
import com.ecommerce.sportscenter.service.AccountService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminBootstrap {
    @Bean
    ApplicationRunner adminAccount(UserRepository users, AccountService accounts,
                                   @Value("${app.admin-username:}") String username,
                                   @Value("${app.admin-email:}") String email,
                                   @Value("${app.admin-password:}") String password) {
        return args -> {
            if (username.isBlank()) return;
            var admin = users.findById(AccountService.normalize(username));
            if (admin.isPresent()) {
                if (admin.get().getRole() != ShopUser.Role.ADMIN) {
                    throw new IllegalStateException("The configured admin username is already registered");
                }
                return;
            }
            if (!username.matches("[a-zA-Z0-9_-]{3,32}") || email.isBlank() || password.length() < 12) {
                throw new IllegalStateException("Configure a valid admin username, email and password of at least 12 characters");
            }
            accounts.register(username, email, password, ShopUser.Role.ADMIN);
        };
    }
}
