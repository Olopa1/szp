package com.example.szp.DTO;

import com.example.szp.models.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupedTasksPage {
    private Map<TaskStatus, List<TaskDataShort>> groupedTasks;
    private int page;
    private int totalPages;
    private long totalElements;
    private int size;
}
