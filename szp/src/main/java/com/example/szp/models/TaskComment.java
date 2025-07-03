package com.example.szp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String comment;
    private LocalDateTime commentDate;
    @ToString.Exclude
    @ManyToOne
    private UserAccount author;
    @ToString.Exclude
    @ManyToOne
    private Task task;
}
