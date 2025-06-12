package com.example.szp.controllers;

import com.example.szp.DTO.ProjectDataShort;
import com.example.szp.DTO.ProjectRequest;
import com.example.szp.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/project")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDataShort> findById(){

    }

    @PostMapping("/createProject")
    public ResponseEntity<String> createProject(@RequestBody ProjectRequest project) {
        projectService.createProject(project);
        return new ResponseEntity<>("Project created", HttpStatus.CREATED);
    }
}
