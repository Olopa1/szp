package com.example.szp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAssignedTasks {
    UserDataShort assignee;
    Set<TaskDataShort> task;
}
