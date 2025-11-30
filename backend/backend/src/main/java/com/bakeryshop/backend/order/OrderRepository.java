// src/main/java/com/bakeryshop/backend/order/OrderRepository.java
package com.bakeryshop.backend.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Use /api/orders?username=xxx
    List<Order> findByUsernameOrderByCreatedAtDesc(String username);
}
