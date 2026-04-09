package com.skillhub.project.service;

import com.skillhub.project.dto.*;
import com.skillhub.project.entity.*;
import com.skillhub.project.enums.ProjectStatus;
import com.skillhub.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectAllocationRepository allocationRepository;
    private final RestTemplate restTemplate;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ProjectDto getProject(Long id) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToDto(p);
    }

    @Transactional
    public ProjectDto createProject(CreateProjectRequest req) {
        Project p = Project.builder()
                .projectName(req.getProjectName())
                .clientName(req.getClientName())
                .description(req.getDescription())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .requiredHeadcount(req.getRequiredHeadcount())
                .status(ProjectStatus.valueOf(req.getStatus()))
                .build();
        return mapToDto(projectRepository.save(p));
    }

    @Transactional
    public ProjectDto updateProject(Long id, CreateProjectRequest req) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        p.setProjectName(req.getProjectName());
        p.setClientName(req.getClientName());
        p.setDescription(req.getDescription());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setRequiredHeadcount(req.getRequiredHeadcount());
        p.setStatus(ProjectStatus.valueOf(req.getStatus()));
        return mapToDto(projectRepository.save(p));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        // Reset employee availability for all allocated employees
        for (ProjectAllocation a : p.getAllocations()) {
            try {
                long remaining = allocationRepository.findByEmployeeId(a.getEmployeeId()).stream()
                        .filter(al -> !al.getProject().getId().equals(id)).count();
                if (remaining == 0) {
                    restTemplate.put("http://AUTH-SERVICE/api/internal/users/" + a.getEmployeeId() + "/availability?status=AVAILABLE", null);
                }
            } catch (Exception ignored) {}
        }
        projectRepository.delete(p);
    }

    @Transactional
    public ProjectDto allocateEmployee(Long projectId, AllocateRequest req) {
        Project p = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Not found"));
        if (allocationRepository.existsByProjectIdAndEmployeeId(projectId, req.getEmployeeId())) {
            throw new RuntimeException("Employee already allocated");
        }
        ProjectAllocation a = ProjectAllocation.builder()
                .project(p).employeeId(req.getEmployeeId())
                .allocationPercentage(req.getAllocationPercentage()).build();
        allocationRepository.save(a);
        try {
            restTemplate.put("http://AUTH-SERVICE/api/internal/users/" + req.getEmployeeId() + "/availability?status=ON_PROJECT", null);
        } catch (Exception ignored) {}
        return mapToDto(projectRepository.findById(projectId).orElseThrow());
    }

    @Transactional
    public ProjectDto deallocateEmployee(Long projectId, Long employeeId) {
        allocationRepository.deleteByProjectIdAndEmployeeId(projectId, employeeId);
        long remaining = allocationRepository.findByEmployeeId(employeeId).size();
        if (remaining == 0) {
            try {
                restTemplate.put("http://AUTH-SERVICE/api/internal/users/" + employeeId + "/availability?status=AVAILABLE", null);
            } catch (Exception ignored) {}
        }
        return mapToDto(projectRepository.findById(projectId).orElseThrow());
    }

    public List<Map<String, Object>> getTeam(Long projectId) {
        List<ProjectAllocation> allocations = allocationRepository.findByProjectId(projectId);
        return allocations.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("allocationId", a.getId());
            m.put("employeeId", a.getEmployeeId());
            m.put("allocationPercentage", a.getAllocationPercentage());
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> user = restTemplate.getForObject(
                        "http://AUTH-SERVICE/api/internal/users/" + a.getEmployeeId(), Map.class);
                m.put("employeeName", user.get("name"));
                m.put("employeeEmail", user.get("email"));
                m.put("designation", user.get("designation"));
            } catch (Exception e) {
                m.put("employeeName", "Unknown");
                m.put("employeeEmail", "");
                m.put("designation", "");
            }
            return m;
        }).collect(Collectors.toList());
    }

    // Stats for dashboard
    public ProjectStatsDto getStats() {
        return ProjectStatsDto.builder()
                .totalProjects(projectRepository.count())
                .activeProjects(projectRepository.countByStatus(ProjectStatus.ACTIVE))
                .build();
    }

    private ProjectDto mapToDto(Project p) {
        return ProjectDto.builder()
                .id(p.getId()).projectName(p.getProjectName()).clientName(p.getClientName())
                .description(p.getDescription()).startDate(p.getStartDate()).endDate(p.getEndDate())
                .requiredHeadcount(p.getRequiredHeadcount()).status(p.getStatus().name())
                .allocatedCount(p.getAllocations().size()).build();
    }
}
