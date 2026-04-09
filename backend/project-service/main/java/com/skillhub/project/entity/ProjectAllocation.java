package com.skillhub.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "project_allocations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectAllocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "allocation_percentage")
    @Builder.Default
    private Integer allocationPercentage = 100;
}
