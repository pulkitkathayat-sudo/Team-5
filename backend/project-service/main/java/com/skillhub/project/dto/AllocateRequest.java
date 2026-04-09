package com.skillhub.project.dto;

import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AllocateRequest { private Long employeeId; private Integer allocationPercentage; }
