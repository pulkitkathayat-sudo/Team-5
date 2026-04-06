package com.skillhub.skill.entity;

import com.skillhub.skill.enums.SkillCategory;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skill_name", nullable = false, unique = true)
    private String skillName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillCategory category;
}
