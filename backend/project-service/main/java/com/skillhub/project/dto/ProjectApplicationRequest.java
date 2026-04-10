package com.skillhub.project.dto;

import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectApplicationRequest { private Long projectId; private String coverNote; }
