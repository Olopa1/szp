package com.example.szp.services;

import com.example.szp.DTO.Comment;
import com.example.szp.DTO.TaskDataShort;
import com.example.szp.DTO.UserDataShort;
import com.example.szp.models.TaskComment;
import com.example.szp.repos.TaskCommentRepo;
import com.example.szp.utils.Mapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final TaskCommentRepo taskCommentRepo;

    public CommentService(TaskCommentRepo taskCommentRepo) {
        this.taskCommentRepo = taskCommentRepo;
    }

    public void saveComment(TaskComment comment) {
        comment.setCommentDate(LocalDateTime.now());
        this.taskCommentRepo.save(comment);
    }

    public List<Comment> getAllComments(List<TaskComment> comments) {
        return comments.stream().map(Mapper::mapComment).collect(Collectors.toList());
    }
    
    public List<Comment> getCommentsByTaskId(Long taskId) {
        return taskCommentRepo.getTaskCommentByTask_Id(taskId).stream().map(Mapper::mapComment).collect(Collectors.toList());
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        return taskCommentRepo.getTaskCommentByAuthor_Id(userId).stream().map(Mapper::mapComment).collect(Collectors.toList());
    }
}
