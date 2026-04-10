package com.skillhub.project.controller;

import com.skillhub.project.dto.ProjectStatsDto;
import com.skillhub.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/projects")
@RequiredArgsConstructor
public class InternalProjectController {

    private final ProjectService projectService;

    @GetMapping("/stats")
    public ResponseEntity<ProjectStatsDto> getStats() {
        return ResponseEntity.ok(projectService.getStats());
    }
}
