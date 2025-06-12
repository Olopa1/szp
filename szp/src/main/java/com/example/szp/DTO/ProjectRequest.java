package com.example.szp.DTO;

import com.example.szp.models.Furniture;
import com.example.szp.models.Task;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ProjectRequest {
    private String projectName;
    private String company;
    private String projectPath;
    private String projectCountry;
}
