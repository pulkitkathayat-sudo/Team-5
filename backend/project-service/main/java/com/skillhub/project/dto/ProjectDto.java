package com.skillhub.project.dto;

import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectDto { private Long id; private String projectName; private String clientName; private String description; private String startDate; private String endDate; private Integer requiredHeadcount; private String status; private int allocatedCount; }
