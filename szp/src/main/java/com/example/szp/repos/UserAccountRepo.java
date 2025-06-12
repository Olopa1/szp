package com.example.szp.repos;

import com.example.szp.models.Task;
import com.example.szp.models.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserAccountRepo extends JpaRepository<UserAccount, Long> {
    UserAccount findByUserName(String username);
    Boolean existsByUserName(String username);
    UserAccount findById(long id);
    @Query("SELECT ua.id FROM UserAccount ua " +
            "INNER JOIN ua.assignedTasksFromMe atfm WHERE atfm.id = :taskId")
    UserAccount findByTaskFrom(Long taskId);
}