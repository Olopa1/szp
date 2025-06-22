package com.example.szp.services;

import com.example.szp.DTO.GroupedTasksPage;
import com.example.szp.DTO.TaskDataDetails;
import com.example.szp.DTO.TaskDataShort;
import com.example.szp.DTO.TaskRequest;
import com.example.szp.models.*;
import com.example.szp.repos.ProjectRepo;
import com.example.szp.repos.TaskRepo;
import com.example.szp.repos.UserAccountRepo;
import com.example.szp.utils.Mapper;
import com.example.szp.utils.TaskSortBy;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
    @Transactional
    public String addTask(TaskRequest req) {
        Task task = new Task();
        task.setTaskName(req.getTaskName());
        task.setTaskDescription(req.getTaskDescription());
        task.setDeadline(req.getDeadline());
        task.setStartDate(req.getStartDate());
        try {
            task.setStatus(TaskStatus.valueOf("TASK_" + req.getStatus()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid task status: " + req.getStatus());
        }
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

    @Transactional
    public Map<TaskStatus,List<TaskDataShort>> getAllTasks() {
        List<Task> tasks = taskRepo.findAll();
        return tasks.stream().map(Mapper::mapTaskDataShort).collect(Collectors.groupingBy(TaskDataShort::getStatus));
    }

    @Transactional
    public TaskDataDetails getTaskById(Long id) {
        Task task = taskRepo.findById(id).orElse(null);
        if (task == null) {
            return null;
        }
        return Mapper.mapTaskDataDetails(task);
    }

    public GroupedTasksPage getAllUserTasks(Long userId, int page, int pageSize, TaskSortBy sortBy) {
        String sortByField = switch(sortBy){
            case SORT_BY_DEADLINE_DATE -> "t.deadline";
            case SORT_BY_PROJECT -> "t.project.projectName";
            case SORT_BY_ASSIGNED_FROM -> "t.assignedFrom.userName";
            default -> "t.project.projectName";
        };
        Pageable pageable = PageRequest.of(page, pageSize);
        System.out.println(userId);
        List<Task> taskPage = taskRepo.findAllTasksByUserId(userId, pageable);

        System.out.println(taskPage);
        //System.out.println("Page info: " + taskPage.getNumber() + " of " + taskPage.getTotalPages() + ", size: " + taskPage.getSize());
        //System.out.println("Content: " + taskPage.getContent());

        Map<TaskStatus,List<TaskDataShort>> grouped = taskPage.stream()
                .map(Mapper::mapTaskDataShort)
                .collect(Collectors.groupingBy(TaskDataShort::getStatus));

        GroupedTasksPage packed =  new GroupedTasksPage();
        //packed.setTotalElements(taskPage.getTotalElements());
        //packed.setTotalPages(taskPage.getTotalPages());
        packed.setPage(page);
        packed.setGroupedTasks(grouped);

        return packed;
    }
}
