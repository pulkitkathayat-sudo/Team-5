package com.skillhub.project.repository;

import com.skillhub.project.entity.Project;
import com.skillhub.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    long countByStatus(ProjectStatus status);
    List<Project> findByStatusIn(List<ProjectStatus> statuses);
}
