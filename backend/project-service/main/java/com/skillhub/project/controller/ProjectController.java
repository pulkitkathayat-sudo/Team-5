package com.skillhub.project.controller;

import com.skillhub.project.dto.*;
import com.skillhub.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAll() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectDto> create(@RequestBody CreateProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectDto> update(@PathVariable Long id, @RequestBody CreateProjectRequest req) {
        return ResponseEntity.ok(projectService.updateProject(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Deleted"));
    }

    @PostMapping("/{id}/allocate")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectDto> allocate(@PathVariable Long id, @RequestBody AllocateRequest req) {
        return ResponseEntity.ok(projectService.allocateEmployee(id, req));
    }

    @DeleteMapping("/{projectId}/allocate/{employeeId}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectDto> deallocate(@PathVariable Long projectId, @PathVariable Long employeeId) {
        return ResponseEntity.ok(projectService.deallocateEmployee(projectId, employeeId));
    }

    @GetMapping("/{id}/team")
    public ResponseEntity<List<Map<String, Object>>> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getTeam(id));
    }
}
