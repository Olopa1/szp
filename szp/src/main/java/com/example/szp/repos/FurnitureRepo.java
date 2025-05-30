package com.example.szp.repos;

import com.example.szp.models.Furniture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FurnitureRepo extends JpaRepository<Furniture, Integer> {
}
