package com.skillhub.skill.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "employee_skills", uniqueConstraints = {@UniqueConstraint(columnNames = {"employee_id", "skill_id"})})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmployeeSkill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer proficiency;

    @Column(name = "years_of_experience")
    private Double yearsOfExperience;
}
