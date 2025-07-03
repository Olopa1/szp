package com.example.szp.models;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.*;

import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
//@ToString(exclude = {"tasks", "assignedTasksFromMe", "myComments", "personalInfo"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userName;
    private UserRole role;
    @ToString.Exclude
    @OneToOne
    private UserPersonalInfo personalInfo;
    private String password;
    private Boolean isUserActive;
    @ToString.Exclude
    @ManyToMany
    @JoinTable(name = "user_task")
    private Set<Task> tasks;
    @ToString.Exclude
    @OneToMany(mappedBy = "assignedFrom")
    private Set<Task> assignedTasksFromMe;
    @ToString.Exclude
    @OneToMany(mappedBy = "author")
    private Set<TaskComment> myComments;
}
