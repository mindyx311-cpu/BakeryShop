package com.bakeryshop.backend.order;

import com.bakeryshop.backend.order.dto.CheckoutRequest;
import com.bakeryshop.backend.order.dto.CheckoutResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    // Order
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        try {
            Order order = orderService.checkout(request);
            return ResponseEntity.ok(
                    new CheckoutResponse(order.getId(), "Checkout success")
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message", "Checkout failed",
                            "error", e.getMessage()
                    ));
        }
    }

    // List a user's orders: GET /api/orders?username=mindy
    @GetMapping
    public ResponseEntity<List<Order>> listOrders(
            @RequestParam("username") String username
    ) {
        List<Order> orders =
                orderRepository.findByUsernameOrderByCreatedAtDesc(username);
        return ResponseEntity.ok(orders);
    }
}
