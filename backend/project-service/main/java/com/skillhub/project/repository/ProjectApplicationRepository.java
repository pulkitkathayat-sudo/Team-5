package com.skillhub.project.repository;

import com.skillhub.project.entity.ProjectApplication;
import com.skillhub.project.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    List<ProjectApplication> findByApplicantId(Long applicantId);
    List<ProjectApplication> findByProjectId(Long projectId);
    List<ProjectApplication> findByStatus(ApplicationStatus status);
    boolean existsByProjectIdAndApplicantId(Long projectId, Long applicantId);
}
