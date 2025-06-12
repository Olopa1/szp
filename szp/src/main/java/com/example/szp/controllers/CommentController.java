package com.example.szp.controllers;

import com.example.szp.DTO.Comment;
import com.example.szp.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    @Autowired
    private CommentService commentService;
    @GetMapping("commentsByTaskId")
    public ResponseEntity<List<Comment>> getCommentsByTaskId(@RequestParam("taskId") Long taskId) {
        return new ResponseEntity<>(commentService.getCommentsByTaskId(taskId),HttpStatus.OK);
    }

    @GetMapping("commentsByUserId")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@RequestParam("taskId") Long userId) {
        return new ResponseEntity<>(commentService.getCommentsByUserId(userId),HttpStatus.OK);
    }

}
