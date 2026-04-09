package com.skillhub.project.repository;

import com.skillhub.project.entity.ProjectAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectAllocationRepository extends JpaRepository<ProjectAllocation, Long> {
    List<ProjectAllocation> findByProjectId(Long projectId);
    List<ProjectAllocation> findByEmployeeId(Long employeeId);
    void deleteByProjectIdAndEmployeeId(Long projectId, Long employeeId);
    boolean existsByProjectIdAndEmployeeId(Long projectId, Long employeeId);
}
