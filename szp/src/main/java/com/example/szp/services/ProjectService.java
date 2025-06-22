package com.example.szp.services;

import com.example.szp.DTO.ProjectDataShort;
import com.example.szp.DTO.ProjectNameAndId;
import com.example.szp.DTO.ProjectRequest;
import com.example.szp.models.Project;
import com.example.szp.repos.ProjectRepo;
import com.example.szp.utils.Mapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepo projectRepo;

    public ProjectService(ProjectRepo projectRepo) {
        this.projectRepo = projectRepo;
    }

    public void createProject(ProjectRequest project) {
        Project newProject = new Project();
        newProject.setCompany(project.getCompany());
        newProject.setProjectName(project.getProjectName());
        newProject.setProjectCountry(project.getProjectCountry());
        newProject.setProjectPath(project.getProjectPath());
        projectRepo.save(newProject);
    }

    public ProjectDataShort getUserById(Long userId) {
        Project project = projectRepo.findById(userId).isPresent() ? projectRepo.findById(userId).get() : null;
        if(project == null) {
            return null;
        }
        return Mapper.mapProjectDataShort(project);
    }

    public List<ProjectNameAndId> getAllProjectsNameAndId() {
        List<Project> projects = projectRepo.findAll();
        return projects.stream().map(Mapper::mapProjectNameAndId).collect(Collectors.toList());

    }
}
