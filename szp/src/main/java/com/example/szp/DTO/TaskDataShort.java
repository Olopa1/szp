package com.example.szp.DTO;

import com.example.szp.models.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDataShort {
    private Long id;
    private String taskName;
    private String projectName;
    private TaskStatus status;
    private Integer priority;
}
