package com.ecommerce.sportscenter.repository;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByBuyerAndBasketId(String buyer, String basketId);
    Optional<Order> findByIdAndBuyer(Integer id, String buyer);
    Page<Order> findByBuyer(String buyer, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Order o where o.id = :id")
    Optional<Order> lockById(@Param("id") Integer id);
}
