package com.skillhub.project.dto;

import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewApplicationRequest { private String status; private String managerNotes; private String interviewDate; }
