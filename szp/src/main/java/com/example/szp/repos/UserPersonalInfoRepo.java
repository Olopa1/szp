package com.example.szp.repos;

import com.example.szp.models.UserPersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPersonalInfoRepo extends JpaRepository<UserPersonalInfo, Long> {
}
