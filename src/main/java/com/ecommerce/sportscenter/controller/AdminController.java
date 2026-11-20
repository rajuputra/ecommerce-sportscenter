package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.entity.Product;
import com.ecommerce.sportscenter.entity.OrderAggregate.OrderStatus;
import com.ecommerce.sportscenter.repository.*;
import com.ecommerce.sportscenter.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    public record ProductInput(@NotBlank @Size(max = 255) String name,
                               @NotBlank @Size(max = 10_000) String description,
                               @NotNull @PositiveOrZero @Max(1_000_000_000_000L) Long price,
                               @NotNull @PositiveOrZero @Max(1_000_000) Integer stock,
                               @NotBlank @Pattern(regexp = "[a-zA-Z0-9_-]+\\.(png|jpg|jpeg|webp)") String pictureUrl,
                               @NotNull @Positive Integer brandId, @NotNull @Positive Integer typeId,
                               @NotNull Boolean active, Long version) {}
    public record ProductView(Integer id, String name, String description, Long price, int stock,
                              String pictureUrl, Integer brandId, Integer typeId, boolean active, long version) {}
    public record StatusInput(@NotNull OrderStatus status) {}

    private final ProductRepository products;
    private final BrandRepository brands;
    private final TypeRepository types;
    private final OrderService orders;

    public AdminController(ProductRepository products, BrandRepository brands, TypeRepository types, OrderService orders) {
        this.products = products;
        this.brands = brands;
        this.types = types;
        this.orders = orders;
    }

    @GetMapping("/products")
    @Transactional(readOnly = true)
    public Page<ProductView> products(@RequestParam(defaultValue = "0") @Min(0) int page) {
        return products.findAll(PageRequest.of(page, 20, Sort.by("id").descending())).map(this::view);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ProductView add(@Valid @RequestBody ProductInput input) {
        return save(new Product(), input);
    }

    @PutMapping("/products/{id}")
    @Transactional
    public ProductView edit(@PathVariable Integer id, @Valid @RequestBody ProductInput input) {
        var product = products.lockById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (input.version() == null || product.getVersion() != input.version()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product changed. Close this form and reload products before editing.");
        }
        return save(product, input);
    }

    @GetMapping("/orders")
    public Page<OrderService.Summary> orders(@RequestParam(defaultValue = "0") @Min(0) int page) {
        return orders.list(null, page);
    }

    @GetMapping("/orders/{id}")
    public OrderService.Detail order(@PathVariable Integer id) {
        return orders.detail(id, null);
    }

    @PatchMapping("/orders/{id}/status")
    public OrderService.Summary status(@PathVariable Integer id, @Valid @RequestBody StatusInput input) {
        return orders.changeStatus(id, null, input.status());
    }

    private ProductView save(Product product, ProductInput input) {
        product.setName(input.name().trim());
        product.setDescription(input.description().trim());
        product.setPrice(input.price());
        product.setStock(input.stock());
        product.setPictureUrl(input.pictureUrl());
        product.setActive(input.active());
        product.setBrand(brands.findById(input.brandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown brand")));
        product.setType(types.findById(input.typeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown type")));
        return view(products.saveAndFlush(product));
    }

    private ProductView view(Product product) {
        String picture = product.getPictureUrl();
        String filename = picture == null ? "" : picture.substring(picture.lastIndexOf('/') + 1);
        return new ProductView(product.getId(), product.getName(), product.getDescription(), product.getPrice(),
                product.getStock(), filename, product.getBrand().getId(), product.getType().getId(),
                product.isActive(), product.getVersion());
    }
}
