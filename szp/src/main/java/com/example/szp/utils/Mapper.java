package com.example.szp.utils;

import com.example.szp.DTO.*;
import com.example.szp.models.*;

import java.util.stream.Collectors;

public class Mapper {
    public static Comment mapComment(TaskComment comment) {
        UserDataShort userData = new UserDataShort();
        userData.setId(comment.getAuthor().getId());
        userData.setUserName(comment.getAuthor().getUserName());
        userData.setFirstName(comment.getAuthor().getPersonalInfo().getFirstName());
        userData.setLastName(comment.getAuthor().getPersonalInfo().getLastName());

        TaskDataShort taskData = new TaskDataShort();
        taskData.setId(comment.getTask().getId());
        taskData.setTaskName(comment.getTask().getTaskName());
        taskData.setStatus(comment.getTask().getStatus());
        taskData.setProjectName(comment.getTask().getProject().getProjectName());
        taskData.setPriority(comment.getTask().getPriority());

        Comment mappedComment = new Comment();
        mappedComment.setComment(comment.getComment());
        mappedComment.setCommentDate(comment.getCommentDate());
        mappedComment.setUser(userData);
        mappedComment.setTask(taskData);
        return mappedComment;
    }

    public static UserDataShort mapUserDataShort(UserAccount user) {
        UserDataShort userData = new UserDataShort();
        userData.setId(user.getId());
        userData.setUserName(user.getUserName());
        userData.setFirstName(user.getPersonalInfo() != null ? user.getPersonalInfo().getFirstName() : "no first name specified");
        userData.setLastName(user.getPersonalInfo() != null ? user.getPersonalInfo().getLastName() : "no last name specified");
        return userData;
    }

    public static UserDataDetails mapUserDataDetails(UserAccount user) {
        UserDataDetails userData = new UserDataDetails();
        userData.setId(user.getId());
        userData.setUserName(user.getUserName());
        userData.setFirstName(user.getPersonalInfo().getFirstName());
        userData.setLastName(user.getPersonalInfo().getLastName());
        userData.setUserRole(user.getRole());
        userData.setEmail(user.getPersonalInfo().getEmail());
        userData.setPhone(user.getPersonalInfo().getPhone());
        return userData;
    }

    public static TaskDataShort mapTaskDataShort(Task task) {
        TaskDataShort taskData = new TaskDataShort();
        taskData.setId(task.getId());
        taskData.setTaskName(task.getTaskName());
        taskData.setStatus(task.getStatus());
        taskData.setProjectName(task.getProject().getProjectName());
        taskData.setPriority(task.getPriority());
        taskData.setRequestFrom(Mapper.mapUserDataShort(task.getAssignedFrom()));
        return taskData;
    }

    public static TaskDataDetails mapTaskDataDetails(Task task) {
        TaskDataDetails taskData = new TaskDataDetails();
        taskData.setId(task.getId());
        taskData.setTaskName(task.getTaskName());
        taskData.setStatus(task.getStatus());
        taskData.setProjectName(task.getProject().getProjectName());
        taskData.setPriority(task.getPriority());
        taskData.setChildrenTasks(
                task.getChildrenTasks().stream().map(Mapper::mapTaskDataShort).collect(Collectors.toList())
        );
        taskData.setComments(
                task.getComments().stream().map(Mapper::mapComment).collect(Collectors.toList())
        );
        taskData.setAssignedFrom(
                Mapper.mapUserDataShort(task.getAssignedFrom())
        );
        taskData.setAssignedTo(
                task.getAssignedTo().stream().map(Mapper::mapUserDataShort).collect(Collectors.toSet())
        );
        taskData.setTaskDescription(task.getTaskDescription());
        taskData.setDeadline(task.getDeadline());
        taskData.setEstimatedWorkTime(task.getStartDate());
        return taskData;
    }

    public static ProjectDataShort mapProjectDataShort(Project project) {
        ProjectDataShort projectData = new ProjectDataShort();
        projectData.setId(project.getId());
        projectData.setProjectName(project.getProjectName());
        projectData.setProjectCountry(project.getProjectCountry());
        projectData.setArchived(project.getArchivised());
        return projectData;
    }

    public static UserAssignedTasks mapUserAssignedTasks(UserAccount user) {
        UserAssignedTasks userAssignedTasks = new UserAssignedTasks();
        userAssignedTasks.setAssignee(mapUserDataShort(user));
        userAssignedTasks.setTask(
                user.getTasks().stream().map(Mapper::mapTaskDataShort).collect(Collectors.toSet())
        );
        return userAssignedTasks;
    }

    public static FurnitureDetails mapFurnitureDetails(Furniture furniture) {
        FurnitureDetails furnitureDetails = new FurnitureDetails();
        furnitureDetails.setId(furniture.getId());
        furnitureDetails.setFurnitureName(furniture.getFurnitureName());
        furnitureDetails.setFurnitureCode(furniture.getFurnitureCode());
        furnitureDetails.setProject(Mapper.mapProjectDataShort(furniture.getProject()));
        return furnitureDetails;
    }

    public static ProjectNameAndId mapProjectNameAndId(Project project) {
        ProjectNameAndId projectNameAndId = new ProjectNameAndId();
        projectNameAndId.setProjectName(project.getProjectName());
        projectNameAndId.setProjectId(project.getId());
        return projectNameAndId;
    }
}
