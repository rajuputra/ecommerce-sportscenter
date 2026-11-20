package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.entity.OrderAggregate.OrderStatus;
import com.ecommerce.sportscenter.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    private final OrderService orders;

    public OrdersController(OrderService orders) {
        this.orders = orders;
    }

    @GetMapping
    public Page<OrderService.Summary> list(Principal principal, @RequestParam(defaultValue = "0") @Min(0) int page) {
        return orders.list(principal.getName(), page);
    }

    @GetMapping("/{id}")
    public OrderService.Detail detail(Principal principal, @PathVariable Integer id) {
        return orders.detail(id, principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Integer create(Principal principal, @Valid @RequestBody OrderService.Checkout checkout) {
        return orders.create(principal.getName(), checkout);
    }

    @PostMapping("/{id}/cancel")
    public OrderService.Summary cancel(Principal principal, @PathVariable Integer id) {
        return orders.changeStatus(id, principal.getName(), OrderStatus.Cancelled);
    }
}
