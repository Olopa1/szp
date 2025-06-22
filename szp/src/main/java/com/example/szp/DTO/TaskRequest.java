package com.example.szp.DTO;

import com.example.szp.models.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TaskRequest {
    private String taskName;
    private String taskDescription;
    private Long projectId;
    private Set<Long> assignedToUserIds;
    private Long assignedFromUserId;
    private LocalDate deadline;
    private LocalDate startDate;
    private String status;
    private Long parentTaskId;
    private Integer priority;
}
