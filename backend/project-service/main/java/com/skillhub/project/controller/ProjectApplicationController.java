package com.skillhub.project.controller;

import com.skillhub.project.dto.*;
import com.skillhub.project.service.ProjectApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ProjectApplicationController {

    private final ProjectApplicationService appService;

    @PostMapping
    public ResponseEntity<?> apply(Authentication auth, @RequestBody ProjectApplicationRequest req) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(appService.apply(auth.getName(), req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectApplicationDto>> myApplications(Authentication auth) {
        return ResponseEntity.ok(appService.getMyApplications(auth.getName()));
    }

    @GetMapping("/available-projects")
    public ResponseEntity<List<ProjectDto>> availableProjects(Authentication auth) {
        return ResponseEntity.ok(appService.getAvailableProjects(auth.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<List<ProjectApplicationDto>> getAll() {
        return ResponseEntity.ok(appService.getAllApplications());
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectApplicationDto> review(@PathVariable Long id, @RequestBody ReviewApplicationRequest req) {
        return ResponseEntity.ok(appService.review(id, req));
    }
}
