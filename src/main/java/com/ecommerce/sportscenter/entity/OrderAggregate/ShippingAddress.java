package com.ecommerce.sportscenter.entity.OrderAggregate;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingAddress {
    @NotBlank @Size(max = 120) private String name;
    @NotBlank @Size(max = 200) private String address1;
    @Size(max = 200) private String address2;
    @NotBlank @Size(max = 100) private String city;
    @NotBlank @Size(max = 100) private String state;
    @NotBlank @Size(max = 20) private String zipCode;
    @NotBlank @Size(max = 100) private String country;
}
