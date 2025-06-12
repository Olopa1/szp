package com.example.szp.services;

import com.example.szp.DTO.TaskRequest;
import com.example.szp.models.*;
import com.example.szp.repos.ProjectRepo;
import com.example.szp.repos.TaskRepo;
import com.example.szp.repos.UserAccountRepo;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TaskService {
    TaskRepo taskRepo;
    ProjectRepo projectRepo;
    UserAccountRepo userAccountRepo;

    public TaskService(TaskRepo taskRepo, ProjectRepo projectRepo, UserAccountRepo userAccountRepo) {
        this.taskRepo = taskRepo;
        this.projectRepo = projectRepo;
        this.userAccountRepo = userAccountRepo;
    }

    public String addTask(TaskRequest req) {
        Task task = new Task();
        task.setTaskName(req.getTaskName());
        task.setTaskDescription(req.getTaskDescription());
        task.setDeadline(req.getDeadline());
        task.setStartDate(req.getStartDate());
        task.setStatus(req.getStatus());
        task.setPriority(req.getPriority());

        // Przypisz projekt
        if (req.getProjectId() != null) {
            projectRepo.findById(req.getProjectId()).ifPresent(task::setProject);
        }

        // Przypisz użytkowników, do których zadanie jest przypisane
        if (req.getAssignedToUserIds() != null) {
            Set<UserAccount> assignedUsers = new HashSet<>(userAccountRepo.findAllById(req.getAssignedToUserIds()));
            task.setAssignedTo(assignedUsers);
        }

        // Kto przypisał to zadanie
        if (req.getAssignedFromUserId() != null) {
            userAccountRepo.findById(req.getAssignedFromUserId()).ifPresent(task::setAssignedFrom);
        }
        else{
            return "Task adding failed no user specified";
        }

        if (req.getParentTaskId() != null) {
            taskRepo.findById(req.getParentTaskId()).ifPresent(task::setParentTask);
        }

        taskRepo.save(task);
        return "Task added successfully";
    }


}
