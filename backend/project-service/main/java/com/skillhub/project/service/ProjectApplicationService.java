package com.skillhub.project.service;

import com.skillhub.project.dto.*;
import com.skillhub.project.entity.*;
import com.skillhub.project.enums.*;
import com.skillhub.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectApplicationService {

    private final ProjectApplicationRepository appRepo;
    private final ProjectRepository projectRepo;
    private final RestTemplate restTemplate;

    @Transactional
    public ProjectApplicationDto apply(String email, ProjectApplicationRequest req) {
        Long userId = getUserIdByEmail(email);
        Project project = projectRepo.findById(req.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (project.getStatus() != ProjectStatus.ACTIVE && project.getStatus() != ProjectStatus.PLANNING) {
            throw new RuntimeException("Project not accepting applications");
        }
        if (appRepo.existsByProjectIdAndApplicantId(project.getId(), userId)) {
            throw new RuntimeException("Already applied");
        }
        ProjectApplication app = ProjectApplication.builder()
                .project(project).applicantId(userId).coverNote(req.getCoverNote()).build();
        return mapToDto(appRepo.save(app));
    }

    public List<ProjectApplicationDto> getMyApplications(String email) {
        Long userId = getUserIdByEmail(email);
        return appRepo.findByApplicantId(userId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ProjectApplicationDto> getAllApplications() {
        return appRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public ProjectApplicationDto review(Long id, ReviewApplicationRequest req) {
        ProjectApplication app = appRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        app.setStatus(ApplicationStatus.valueOf(req.getStatus()));
        if (req.getManagerNotes() != null) app.setManagerNotes(req.getManagerNotes());
        if (req.getInterviewDate() != null) app.setInterviewDate(LocalDateTime.parse(req.getInterviewDate()));
        return mapToDto(appRepo.save(app));
    }

    public List<ProjectDto> getAvailableProjects(String email) {
        getUserIdByEmail(email); // validate user
        return projectRepo.findByStatusIn(List.of(ProjectStatus.ACTIVE, ProjectStatus.PLANNING)).stream()
                .map(p -> ProjectDto.builder()
                        .id(p.getId()).projectName(p.getProjectName()).clientName(p.getClientName())
                        .description(p.getDescription()).startDate(p.getStartDate()).endDate(p.getEndDate())
                        .requiredHeadcount(p.getRequiredHeadcount()).status(p.getStatus().name())
                        .allocatedCount(p.getAllocations().size()).build())
                .collect(Collectors.toList());
    }

    private Long getUserIdByEmail(String email) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> user = restTemplate.getForObject(
                    "http://AUTH-SERVICE/api/internal/users/by-email/" + email, Map.class);
            return ((Number) user.get("id")).longValue();
        } catch (Exception e) {
            throw new RuntimeException("Auth service unavailable: " + e.getMessage());
        }
    }

    private ProjectApplicationDto mapToDto(ProjectApplication app) {
        String applicantName = "Unknown", applicantEmail = "", applicantDesignation = "", applicantDepartment = "";
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> user = restTemplate.getForObject(
                    "http://AUTH-SERVICE/api/internal/users/" + app.getApplicantId(), Map.class);
            applicantName = (String) user.get("name");
            applicantEmail = (String) user.get("email");
            applicantDesignation = (String) user.get("designation");
            applicantDepartment = (String) user.get("department");
        } catch (Exception ignored) {}

        return ProjectApplicationDto.builder()
                .id(app.getId()).projectId(app.getProject().getId())
                .projectName(app.getProject().getProjectName())
                .clientName(app.getProject().getClientName())
                .applicantId(app.getApplicantId())
                .applicantName(applicantName).applicantEmail(applicantEmail)
                .applicantDesignation(applicantDesignation).applicantDepartment(applicantDepartment)
                .coverNote(app.getCoverNote()).status(app.getStatus().name())
                .managerNotes(app.getManagerNotes()).interviewDate(app.getInterviewDate())
                .appliedAt(app.getAppliedAt()).build();
    }
}
