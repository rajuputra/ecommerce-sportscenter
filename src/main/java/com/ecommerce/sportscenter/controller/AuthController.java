package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.entity.ShopUser;
import com.ecommerce.sportscenter.security.JwtHelper;
import com.ecommerce.sportscenter.service.AccountService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public record Login(@NotBlank @Size(max = 32) String username, @NotBlank @Size(max = 72) String password) {}
    public record Registration(@NotNull @Pattern(regexp = "[a-zA-Z0-9_-]{3,32}") String username,
                               @NotBlank @Email @Size(max = 254) String email,
                               @NotBlank @Size(min = 8, max = 72) String password) {}
    public record Profile(String username, boolean admin) {}
    public record Session(String username, boolean admin, String token) {}

    private final AccountService accounts;
    private final AuthenticationManager manager;
    private final JwtHelper jwt;

    public AuthController(AccountService accounts, AuthenticationManager manager, JwtHelper jwt) {
        this.accounts = accounts;
        this.manager = manager;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody Registration input) {
        accounts.register(input.username(), input.email(), input.password(), ShopUser.Role.CUSTOMER);
    }

    @PostMapping("/login")
    public Session login(@Valid @RequestBody Login input) {
        try {
            Authentication authentication = manager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(
                    AccountService.normalize(input.username()), input.password()));
            Profile profile = profile(authentication);
            return new Session(profile.username(), profile.admin(), jwt.issue(profile.username()));
        } catch (AuthenticationException | IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
    }

    @GetMapping("/user")
    public Profile profile(Authentication authentication) {
        return new Profile(authentication.getName(), authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN")));
    }
}
