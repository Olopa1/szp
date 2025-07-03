package com.example.szp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String projectName;
    private String company;
    private String projectPath;
    private String projectCountry;
    @ToString.Exclude
    @OneToMany(mappedBy = "project")
    List<Furniture> furnitures;
    @ToString.Exclude
    @OneToMany(mappedBy = "project")
    List<Task> tasks;

    Boolean archivised;
}
