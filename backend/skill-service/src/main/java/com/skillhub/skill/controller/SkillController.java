package com.skillhub.skill.controller;

import com.skillhub.skill.dto.*;
import com.skillhub.skill.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/catalog")
    public ResponseEntity<List<Map<String, Object>>> getCatalog() {
        return ResponseEntity.ok(skillService.getCatalog());
    }

    @GetMapping("/my")
    public ResponseEntity<List<EmployeeSkillDto>> getMySkills(Authentication auth) {
        return ResponseEntity.ok(skillService.getMySkills(auth.getName()));
    }

    @PostMapping("/my")
    public ResponseEntity<?> addSkill(Authentication auth, @RequestBody AddSkillRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(skillService.addSkill(auth.getName(), request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/my/{id}")
    public ResponseEntity<?> updateSkill(Authentication auth, @PathVariable Long id, @RequestBody AddSkillRequest request) {
        try {
            return ResponseEntity.ok(skillService.updateSkill(auth.getName(), id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/my/{id}")
    public ResponseEntity<?> deleteSkill(Authentication auth, @PathVariable Long id) {
        try {
            skillService.deleteSkill(auth.getName(), id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Skill removed"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
