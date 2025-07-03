package com.example.szp.repos;

import com.example.szp.models.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TaskRepo extends JpaRepository<Task, Long> {
    Task findByTaskName(String taskName);
    Task findById(long id);

    @Query("SELECT t FROM Task t")
    Page<Task> findAllTasks(Pageable pageable);

    @Query("SELECT t FROM Task t INNER JOIN t.assignedTo at WHERE at.id = :userId")
    Page<Task> findAllTasksByUserId(Long userId, Pageable pageable);

    @Query("SELECT t FROM Task t INNER JOIN t.assignedTo at WHERE at.id = :parentId")
    List<Task> findAllChildrenTasksByParentId(Long parentId);
    
    @Query("SELECT t FROM Task t WHERE t.assignedFrom.id = :parentId")
    List<Task> findMyAllAssignedTasksByUserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.project.archivised = FALSE")
    List<Task> findAllTasksWhereIsNotArchived();
}
