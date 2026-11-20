package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.OrderAggregate.*;
import com.ecommerce.sportscenter.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.*;

@Service
public class OrderService {
    public static final long DELIVERY_FEE = 35_000;
    public record Line(@NotNull @Positive Integer productId, @NotNull @Min(1) @Max(99) Integer quantity,
                       @NotNull @PositiveOrZero Long unitPrice) {}
    public record Checkout(@NotNull @Pattern(regexp = "[a-zA-Z0-9_-]{16,64}") String basketId,
                           @NotNull @Valid ShippingAddress shippingAddress,
                           @NotEmpty @Size(max = 50) List<@NotNull @Valid Line> items) {}
    public record Item(Integer productId, String name, String pictureUrl, Long price, Integer quantity) {}
    public record Summary(Integer id, String buyer, Instant orderDate, OrderStatus orderStatus,
                          long subTotal, long deliveryFee, long total) {}
    public record Detail(Summary summary, ShippingAddress shippingAddress, List<Item> items) {}

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;

    public OrderService(OrderRepository orders, ProductRepository products, UserRepository users) {
        this.orders = orders;
        this.products = products;
        this.users = users;
    }

    @Transactional
    public Integer create(String buyer, Checkout checkout) {
        users.lockByUsername(buyer).orElseThrow();
        var existing = orders.findByBuyerAndBasketId(buyer, checkout.basketId());
        if (existing.isPresent()) return existing.get().getId();

        var lines = new TreeMap<Integer, Line>();
        for (Line line : checkout.items()) {
            if (lines.putIfAbsent(line.productId(), line) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate product in basket");
            }
        }

        var order = new Order();
        order.setBuyer(buyer);
        order.setBasketId(checkout.basketId());
        order.setShippingAddress(checkout.shippingAddress());
        order.setOrderDate(LocalDateTime.now(ZoneOffset.UTC));
        order.setDeliveryFee(DELIVERY_FEE);
        long subtotal = 0;

        for (Line line : lines.values()) {
            var product = products.lockById(line.productId())
                    .orElseThrow(() -> conflict("A product is no longer available"));
            if (!product.isActive() || product.getStock() < line.quantity()) {
                throw conflict("Not enough stock for " + product.getName());
            }
            if (!product.getPrice().equals(line.unitPrice())) {
                throw conflict("The price of " + product.getName() + " changed. Review your basket again.");
            }
            product.setStock(product.getStock() - line.quantity());
            var item = new OrderItem();
            item.setItemOrdered(new ProductItemOrdered(product.getId(), product.getName(), product.getPictureUrl()));
            item.setQuantity(line.quantity());
            item.setPrice(product.getPrice());
            order.addItem(item);
            subtotal += product.getPrice() * line.quantity();
        }

        order.setSubTotal(subtotal);
        return orders.save(order).getId();
    }

    @Transactional(readOnly = true)
    public Page<Summary> list(String buyer, int page) {
        var pageable = PageRequest.of(page, 20, Sort.by("id").descending());
        return (buyer == null ? orders.findAll(pageable) : orders.findByBuyer(buyer, pageable)).map(this::summary);
    }

    @Transactional(readOnly = true)
    public Detail detail(Integer id, String buyer) {
        var order = (buyer == null ? orders.findById(id) : orders.findByIdAndBuyer(id, buyer))
                .orElseThrow(OrderService::notFound);
        var items = order.getOrderItems().stream()
                .map(item -> new Item(item.getItemOrdered().getProductId(), item.getItemOrdered().getName(),
                        item.getItemOrdered().getPictureUrl(), item.getPrice(), item.getQuantity())).toList();
        return new Detail(summary(order), order.getShippingAddress(), items);
    }

    @Transactional
    public Summary changeStatus(Integer id, String buyer, OrderStatus next) {
        var order = orders.lockById(id).orElseThrow(OrderService::notFound);
        if (buyer != null && !buyer.equals(order.getBuyer())) throw notFound();

        var current = order.getOrderStatus();
        if (current == next) return summary(order);
        boolean allowed = switch (current) {
            case Pending -> next == OrderStatus.Processing || next == OrderStatus.Cancelled;
            case Processing -> next == OrderStatus.Shipped;
            case Shipped -> next == OrderStatus.Completed;
            default -> false;
        };
        if (!allowed) throw conflict("This status change is not available");

        if (next == OrderStatus.Cancelled && order.getBuyer() != null) {
            var quantities = new TreeMap<Integer, Integer>();
            for (OrderItem item : order.getOrderItems()) {
                quantities.merge(item.getItemOrdered().getProductId(), item.getQuantity(), Integer::sum);
            }
            quantities.forEach((productId, quantity) -> {
                var product = products.lockById(productId).orElseThrow();
                product.setStock(Math.addExact(product.getStock(), quantity));
            });
        }
        order.setOrderStatus(next);
        return summary(order);
    }

    private Summary summary(Order order) {
        long subtotal = Objects.requireNonNullElse(order.getSubTotal(), 0L);
        long fee = Objects.requireNonNullElse(order.getDeliveryFee(), 0L);
        Instant timestamp = order.getOrderDate() == null ? null : order.getOrderDate().toInstant(ZoneOffset.UTC);
        return new Summary(order.getId(), order.getBuyer(), timestamp, order.getOrderStatus(), subtotal, fee, subtotal + fee);
    }

    private static ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    private static ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
    }
}
