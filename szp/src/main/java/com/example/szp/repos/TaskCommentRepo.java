package com.example.szp.repos;

import com.example.szp.DTO.Comment;
import com.example.szp.models.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskCommentRepo extends JpaRepository<TaskComment, Long> {
    List<TaskComment> getTaskCommentByTask_Id(Long taskId);

    List<TaskComment> getTaskCommentByAuthor_Id(Long authorId);
}
