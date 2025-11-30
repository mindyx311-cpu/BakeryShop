// src/main/java/com/bakeryshop/backend/order/dto/OrderDetailResponse.java
package com.bakeryshop.backend.order.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderDetailResponse {
    private Long id;
    private String status;
    private Integer totalPriceCents;
    private String createdAt;
    private List<OrderItemDto> items;
}
