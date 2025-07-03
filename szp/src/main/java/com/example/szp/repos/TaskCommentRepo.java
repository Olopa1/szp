package com.example.szp.repos;

import com.example.szp.DTO.Comment;
import com.example.szp.models.TaskComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskCommentRepo extends JpaRepository<TaskComment, Long> {
    Page<TaskComment> getTaskCommentByTask_Id(Long taskId, Pageable pageable);

    List<TaskComment> getTaskCommentByAuthor_Id(Long authorId);
}
