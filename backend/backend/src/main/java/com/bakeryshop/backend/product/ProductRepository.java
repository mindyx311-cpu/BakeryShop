// src/main/java/com/bakeryshop/backend/product/ProductRepository.java
package com.bakeryshop.backend.product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
