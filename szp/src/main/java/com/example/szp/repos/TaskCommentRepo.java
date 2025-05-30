package com.example.szp.repos;

import com.example.szp.models.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskCommentRepo extends JpaRepository<TaskComment, Long> {
}
