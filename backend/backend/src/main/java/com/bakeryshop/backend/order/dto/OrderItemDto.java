// src/main/java/com/bakeryshop/backend/order/dto/OrderItemDto.java
package com.bakeryshop.backend.order.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long productId;
    private String name;
    private Integer priceCents;
    private Integer quantity;
}
