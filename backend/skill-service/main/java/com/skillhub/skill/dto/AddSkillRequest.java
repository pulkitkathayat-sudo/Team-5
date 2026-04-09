package com.skillhub.skill.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AddSkillRequest {
    private Long skillId;
    private Integer proficiency;
    private Double yearsOfExperience;
}
