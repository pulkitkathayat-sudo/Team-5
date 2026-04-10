package com.skillhub.project.dto;

import lombok.*; import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectApplicationDto { private Long id; private Long projectId; private String projectName; private String clientName; private Long applicantId; private String applicantName; private String applicantEmail; private String applicantDesignation; private String applicantDepartment; private String coverNote; private String status; private String managerNotes; private LocalDateTime interviewDate; private LocalDateTime appliedAt; }
