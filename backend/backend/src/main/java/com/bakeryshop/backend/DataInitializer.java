// src/main/java/com/bakeryshop/backend/DataInitializer.java
package com.bakeryshop.backend;

import com.bakeryshop.backend.product.Product;
import com.bakeryshop.backend.product.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final ProductRepository productRepository;

    @PostConstruct
    public void init() {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.save(
                new Product(
                        "Baguette",
                        "Classic French baguette, crispy on the outside and soft on the inside, freshly baked daily.",
                        350,                    // $3.50 -> 350 分
                        50,
                        null
                )
        );

        productRepository.save(
                new Product(
                        "Croissant",
                        "Croissants with a rich, buttery aroma are a top choice for breakfast.",
                        420,                    // $4.20
                        40,
                        null
                )
        );

        productRepository.save(
                new Product(
                        "Chocolate Toast",
                        "Soft toast with chocolate filling, perfect for afternoon tea.",
                        580,                    // $5.80
                        30,
                        null
                )
        );

        productRepository.save(
                new Product(
                        "Croissant",
                        "Fresh butter croissant",
                        350,
                        60,
                        null
                )
        );

        productRepository.save(
                new Product(
                        "Chocolate Cake",
                        "Rich dark chocolate cake",
                        2500,
                        20,
                        null
                )
        );

        productRepository.save(
                new Product(
                        "Baguette",
                        "Classic French baguette",
                        400,
                        35,
                        null
                )
        );
    }
}
