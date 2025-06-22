package com.example.szp.controllers;

import com.example.szp.DTO.ProjectDataShort;
import com.example.szp.DTO.ProjectNameAndId;
import com.example.szp.DTO.ProjectRequest;
import com.example.szp.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/project")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDataShort> findById(@PathVariable Long id) {
        ProjectDataShort projects = projectService.getUserById(id);
        if (projects == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @PostMapping("/createProject")
    public ResponseEntity<String> createProject(@RequestBody ProjectRequest project) {
        projectService.createProject(project);
        return new ResponseEntity<>("Project created", HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/getAllProjectsNames")
    public ResponseEntity<List<ProjectNameAndId>> getAllProjectsNames() {
        return new ResponseEntity<>(projectService.getAllProjectsNameAndId(), HttpStatus.OK);
    }
}
