package com.example.szp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ProjectName {
    private String projectName;
    private Long projectId;
    private String projectDescription;
}
