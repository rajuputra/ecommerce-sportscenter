package com.ecommerce.sportscenter.entity.OrderAggregate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Orders", uniqueConstraints = @UniqueConstraint(columnNames = {"Buyer", "Basket_Id"}))
@Getter
@Setter
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Basket_Id", length = 64)
    private String basketId;

    @Column(name = "Buyer", length = 32)
    private String buyer;

    @Embedded
    private ShippingAddress shippingAddress;

    @Column(name = "Order_Date")
    private LocalDateTime orderDate;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "Sub_Total")
    private Long subTotal;

    @Column(name = "Delivery_Fee")
    private Long deliveryFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "Order_Status")
    private OrderStatus orderStatus = OrderStatus.Pending;

    public void addItem(OrderItem item) {
        item.setOrder(this);
        orderItems.add(item);
    }
}
