package com.example.szp.models;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userName;
    private UserRole role;
    @OneToOne
    private UserPersonalInfo personalInfo;
    private String password;
    private Boolean isUserActive;
    @ManyToMany
    @JoinTable(name = "user_task")
    private Set<Task> tasks;
    @OneToMany(mappedBy = "assignedFrom")
    private Set<Task> assignedTasksFromMe;
    @OneToMany(mappedBy = "author")
    private Set<TaskComment> myComments;
}
