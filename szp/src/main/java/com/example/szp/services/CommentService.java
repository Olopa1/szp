package com.example.szp.services;

import com.example.szp.DTO.CommentWithId;
import com.example.szp.DTO.Comment;
import com.example.szp.models.Task;
import com.example.szp.models.TaskComment;
import com.example.szp.models.UserAccount;
import com.example.szp.repos.TaskCommentRepo;
import com.example.szp.repos.TaskRepo;
import com.example.szp.repos.UserAccountRepo;
import com.example.szp.utils.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final TaskCommentRepo taskCommentRepo;
    private final UserAccountRepo userAccountRepo;
    private final TaskRepo taskRepo;

    public CommentService(TaskCommentRepo taskCommentRepo, UserAccountRepo userAccountRepo, TaskRepo taskRepo) {
        this.taskCommentRepo = taskCommentRepo;
        this.userAccountRepo = userAccountRepo;
        this.taskRepo = taskRepo;
    }

    public boolean saveComment(CommentWithId comment) {
        TaskComment taskComment = new TaskComment();
        UserAccount commentingUser = userAccountRepo.findById(comment.getUserId()).orElse(null);
        if(commentingUser == null){
            return false;
        }
        Task task = taskRepo.findById(comment.getTaskId()).orElse(null);
        if(task == null){
            return false;
        }
        taskComment.setComment(comment.getComment());
        taskComment.setCommentDate(comment.getCommentDate());
        taskComment.setAuthor(commentingUser);
        taskComment.setTask(task);
        taskCommentRepo.save(taskComment);
        System.out.println(taskComment);
        return true;
    }

    public List<Comment> getAllComments(List<TaskComment> comments) {
        return comments.stream().map(Mapper::mapComment).collect(Collectors.toList());
    }
    
    public Page<Comment> getCommentsByTaskId(Long taskId, Pageable pageable) {
        Page<TaskComment> page = taskCommentRepo.getTaskCommentByTask_Id(taskId, pageable);
        for(TaskComment taskComment : page.getContent()){
            System.out.println(taskComment);
        }
        return page.map(Mapper::mapComment);
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        return taskCommentRepo.getTaskCommentByAuthor_Id(userId).stream().map(Mapper::mapComment).collect(Collectors.toList());
    }
}
