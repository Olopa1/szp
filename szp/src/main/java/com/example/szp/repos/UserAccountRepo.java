package com.example.szp.repos;

import com.example.szp.models.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepo extends JpaRepository<UserAccount, Long> {
    UserAccount findByUserName(String username);
    Boolean existsByUserName(String username);
}