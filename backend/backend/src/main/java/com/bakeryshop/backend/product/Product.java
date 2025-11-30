// src/main/java/com/bakeryshop/backend/product/Product.java
package com.bakeryshop.backend.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;


    @Column(name = "price_cents", nullable = false)
    private Integer priceCents;

    @Column(nullable = false)
    private Integer stock;

    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Product(String name, String description, Integer priceCents, Integer stock, String imageUrl) {
        this.name = name;
        this.description = description;
        this.priceCents = priceCents;
        this.stock = stock;
        this.imageUrl = imageUrl;
    }
}
