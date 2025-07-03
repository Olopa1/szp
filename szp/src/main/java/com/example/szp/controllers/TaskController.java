package com.example.szp.controllers;

import com.example.szp.DTO.*;
import com.example.szp.models.Task;
import com.example.szp.models.TaskStatus;
import com.example.szp.services.TaskService;
import com.example.szp.utils.TaskSortBy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @PostMapping("addNewTask")
    public ResponseEntity<String> addNewTask(
            @RequestBody TaskRequest task) {
        System.out.println(task);
        String response = taskService.addTask(task);
        if(response.equals("Task added successfully")) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @GetMapping("/getUserTasks")
    public ResponseEntity<GroupedTasksPage> getUserTasks(
            @RequestParam("id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "SORT_BY_USERNAME") TaskSortBy sortBy
    ) {
        GroupedTasksPage result = taskService.getAllUserTasks(userId, page, size, sortBy);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @GetMapping("/getAllTasks")
    public ResponseEntity<GroupedTasksPage> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "SORT_BY_USERNAME") TaskSortBy sortBy
    ){
        GroupedTasksPage result = taskService.getAllTasks(page,size,sortBy);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        boolean outcome = taskService.updateTaskStatus(id, request.getStatus());
        if(outcome) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @GetMapping("/getTaskById/{id}")
    public ResponseEntity<TaskDataDetails> getTaskById(@PathVariable("id") Long taskId) {
        TaskDataDetails task = taskService.getTaskById(taskId);
        System.out.println(task);
        if(task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(task, HttpStatus.OK);
    }
}
