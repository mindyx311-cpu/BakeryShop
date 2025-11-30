// src/main/java/com/bakeryshop/backend/order/dto/CreateOrderRequest.java
package com.bakeryshop.backend.order.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private String username;
    private List<OrderItemDto> items;
}
