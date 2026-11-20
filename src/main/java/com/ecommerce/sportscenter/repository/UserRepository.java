package com.ecommerce.sportscenter.repository;

import com.ecommerce.sportscenter.entity.ShopUser;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<ShopUser, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from ShopUser u where u.username = :username")
    Optional<ShopUser> lockByUsername(@Param("username") String username);
}
