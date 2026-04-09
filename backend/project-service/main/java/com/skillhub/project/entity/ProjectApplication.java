package com.skillhub.project.entity;

import com.skillhub.project.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "project_applications", uniqueConstraints = {@UniqueConstraint(columnNames = {"project_id", "applicant_id"})})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectApplication {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "applicant_id", nullable = false)
    private Long applicantId;

    @Column(columnDefinition = "TEXT")
    private String coverNote;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "manager_notes", columnDefinition = "TEXT")
    private String managerNotes;

    @Column(name = "interview_date")
    private LocalDateTime interviewDate;

    @Column(name = "applied_at")
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();
}
