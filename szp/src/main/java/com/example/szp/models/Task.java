package com.example.szp.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String taskName;
    private String taskDescription;
    @ManyToOne
    private Project project;
    @ManyToMany(mappedBy = "tasks")
    private Set<UserAccount> assignedTo;
    private LocalDate startDate;
    private LocalDate deadline;
    @ManyToOne
    private UserAccount assignedFrom;
    private TaskStatus status;
    @OneToMany(mappedBy = "task")
    private List<TaskComment> comments;

    @ManyToOne
    @JsonBackReference
    private Task parentTask;

    @OneToMany(mappedBy = "parentTask")
    @JsonManagedReference
    private List<Task> childrenTasks;

    private Integer priority;
}
