// src/main/java/com/bakeryshop/backend/order/dto/OrderSummaryResponse.java
package com.bakeryshop.backend.order.dto;

import lombok.Data;

@Data
public class OrderSummaryResponse {
    private Long id;
    private String status;
    private Integer totalPriceCents;
    private String createdAt;
}
