package com.example.szp.controllers;

import com.example.szp.DTO.CommentWithId;
import com.example.szp.DTO.Comment;
import com.example.szp.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PreAuthorize("hasAnyRole('ADMIN','NORMAL_USER')")
    @PostMapping("addComment")
    public ResponseEntity<?> addComment(@RequestBody CommentWithId comment) {
        System.out.println(comment);
        boolean addedComment = commentService.saveComment(comment);
        if(addedComment){
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @PreAuthorize("hasAnyRole('ADMIN','NORMAL_USER')")
    @GetMapping("commentsByTaskId")
    public ResponseEntity<Page<Comment>> getCommentsByTaskId(
            @RequestParam("taskId") Long taskId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentsPage = commentService.getCommentsByTaskId(taskId, pageable);
        return new ResponseEntity<>(commentsPage, HttpStatus.OK);
    }

    @GetMapping("commentsByUserId")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@RequestParam("taskId") Long userId) {
        return new ResponseEntity<>(commentService.getCommentsByUserId(userId),HttpStatus.OK);
    }

}
