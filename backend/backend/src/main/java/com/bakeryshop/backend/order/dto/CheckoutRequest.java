package com.bakeryshop.backend.order.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {

    // The current logged-in username is passed from useAuth by the frontend.
    private String username;

    private List<Item> items;

    @Data
    public static class Item {
        private Long productId;
        private int quantity;
    }
}
