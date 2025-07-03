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
        task.setPriority(req.getPriority());

        // Ustawienie statusu - bez TASK_ prefixu, jeśli enum tego nie wymaga
        try {
            task.setStatus(TaskStatus.valueOf("TASK_"+req.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid task status: " + req.getStatus());
        }

        // Przypisanie projektu
        if (req.getProjectId() != null) {
            Project project = projectRepo.findById(req.getProjectId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + req.getProjectId()));
            task.setProject(project);
        }

        // Przypisanie użytkowników do zadania
        if (req.getAssignedToUserIds() != null && !req.getAssignedToUserIds().isEmpty()) {
            Set<UserAccount> assignedUsers = new HashSet<>();

            for(Long id : req.getAssignedToUserIds()) {
                if(userAccountRepo.findById(id).isPresent()) {
                    assignedUsers.add(userAccountRepo.findById(id).get());
                }
            }


            task.setAssignedTo(assignedUsers);

            // Ustaw relację odwrotną
            for (UserAccount user : assignedUsers) {
                user.getTasks().add(task);
            }
        }

        // Kto przypisał zadanie (obowiązkowe)
        if (req.getAssignedFromUserId() != null) {
            UserAccount fromUser = userAccountRepo.findById(req.getAssignedFromUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User who assigns the task not found: " + req.getAssignedFromUserId()));
            task.setAssignedFrom(fromUser);
        } else {
            throw new IllegalArgumentException("Task adding failed: no user specified as assignedFrom.");
        }

        // Ustawienie zadania nadrzędnego (jeśli jest)
        if (req.getParentTaskId() != null) {
            Task parentTask = taskRepo.findById(req.getParentTaskId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent task not found with ID: " + req.getParentTaskId()));
            task.setParentTask(parentTask);
        }

        // Zapis i flush
        taskRepo.save(task);
        taskRepo.flush(); // upewnia się, że dane są w bazie

        return "Task added successfully";
    }

    @Transactional
    public boolean updateTaskStatus(Long id, String status){
        Task task = taskRepo.findById(id).orElse(null);
        if (task == null) {
            return false;
        }
        task.setStatus(TaskStatus.valueOf(status));
        taskRepo.save(task);
        taskRepo.flush();
        return true;
    }

    @Transactional
    public GroupedTasksPage getAllTasks(int page, int pageSize, TaskSortBy sortBy) {
        String sortByField = switch(sortBy){
            case SORT_BY_DEADLINE_DATE -> "t.deadline";
            case SORT_BY_PROJECT -> "t.project.projectName";
            case SORT_BY_ASSIGNED_FROM -> "t.assignedFrom.userName";
            default -> "t.project.projectName";
        };
        Sort sort = Sort.by(sortByField);
        Pageable pageable = PageRequest.of(page,pageSize,sort);
        Page<Task> tasks = taskRepo.findAllTasks(pageable);
        return getGroupedTasksPage(tasks);
    }

    private GroupedTasksPage getGroupedTasksPage(Page<Task> tasks) {
        Map<TaskStatus, List<TaskDataShort>> grouped = tasks.stream()
                .map(Mapper::mapTaskDataShort)
                .collect(Collectors.groupingBy(TaskDataShort::getStatus));
        GroupedTasksPage packed = new GroupedTasksPage();
        packed.setPage(tasks.getNumber());
        packed.setSize(tasks.getSize());
        packed.setTotalElements(tasks.getTotalElements());
        packed.setTotalPages(tasks.getTotalPages());
        packed.setGroupedTasks(grouped);
        return packed;
    }

    @Transactional
    public TaskDataDetails getTaskById(Long id) {
        Task task = taskRepo.findById(id).orElse(null);
        if (task == null) {
            return null;
        }
        return Mapper.mapTaskDataDetails(task);
    }

    @Transactional
    public GroupedTasksPage getAllUserTasks(Long userId, int page, int pageSize, TaskSortBy sortBy) {
        String sortByField = switch(sortBy){
            case SORT_BY_DEADLINE_DATE -> "t.deadline";
            case SORT_BY_PROJECT -> "t.project.projectName";
            case SORT_BY_ASSIGNED_FROM -> "t.assignedFrom.userName";
            default -> "t.project.projectName";
        };
        Sort sort = Sort.by(sortByField).ascending();
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Task> taskPage = taskRepo.findAllTasksByUserId(userId, pageable);

        return getGroupedTasksPage(taskPage);
    }
}
