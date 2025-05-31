package com.example.szp.DTO;

import com.example.szp.models.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class TaskDataDetails {
    Long id;
    String taskName;
    String taskDescription;
    String projectName;
    Set<UserDataShort> assignedTo;
    UserDataShort assignedFrom;
    TaskStatus status;
    LocalDate deadline;
    LocalDate estimatedWorkTime;
    List<Comment> comments;
    List<TaskDataShort> childrenTasks;
    Integer priority;
}
