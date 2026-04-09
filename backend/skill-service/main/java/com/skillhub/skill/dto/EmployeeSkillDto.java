package com.skillhub.skill.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeSkillDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private Integer proficiency;
    private Double yearsOfExperience;
}
