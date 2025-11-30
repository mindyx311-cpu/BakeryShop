// src/main/java/com/bakeryshop/backend/order/OrderService.java
package com.bakeryshop.backend.order;

import com.bakeryshop.backend.order.dto.CheckoutRequest;
import com.bakeryshop.backend.product.Product;
import com.bakeryshop.backend.product.ProductRepository;
import com.bakeryshop.backend.user.User;
import com.bakeryshop.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Order checkout(CheckoutRequest request) {

        String username = request.getUsername();
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Username is required for checkout");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutRequest.Item itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found: " + itemReq.getProductId())
                    );

            Integer priceCents = product.getPriceCents();
            if (priceCents == null) {
                throw new RuntimeException("Product price is null: " + product.getId());
            }

            BigDecimal price = BigDecimal
                    .valueOf(priceCents)
                    .divide(BigDecimal.valueOf(100));

            BigDecimal subTotal = price.multiply(
                    BigDecimal.valueOf(itemReq.getQuantity())
            );
            total = total.add(subTotal);

            String productName = product.getName();


            String imageUrl = product.getImageUrl();
            if (imageUrl == null || imageUrl.isBlank()) {
                imageUrl = resolveImageUrlByProductName(productName);
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(productName)
                    .productImageUrl(imageUrl)
                    .quantity(itemReq.getQuantity())
                    .price(price)
                    .build();

            orderItems.add(orderItem);
        }

        Order order = Order.builder()
                .user(user)
                .username(username)
                .totalAmount(total)
                .status("PLACED")
                .createdAt(LocalDateTime.now())
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);

        return orderRepository.save(order);
    }


    private String resolveImageUrlByProductName(String productName) {
        if (productName == null) return null;
        String lower = productName.toLowerCase();

        if (lower.contains("baguette")) return "/images/Baguette.jpg";
        if (lower.contains("chocolate") && lower.contains("cake")) return "/images/chocolate cake.jpg";
        if (lower.contains("chocolate")) return "/images/chocolate-toast.jpg";
        if (lower.contains("croissant")) return "/images/croissants.jpg";
        if (lower.contains("garlic")) return "/images/Garlic-Bread.jpg";
        if (lower.contains("wheat")) return "/images/wheat Loaf.jpg";

        return null;
    }
}
