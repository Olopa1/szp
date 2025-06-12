package com.example.szp.controllers;

import com.example.szp.DTO.TaskRequest;
import com.example.szp.models.Task;
import com.example.szp.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @PostMapping("addNewTask")
    public ResponseEntity<String> addNewTask(
            @RequestBody TaskRequest task) {
        String response = taskService.addTask(task);
        if(response.equals("Task added successfully")) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
