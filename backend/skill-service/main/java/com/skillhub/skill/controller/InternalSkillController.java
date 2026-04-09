package com.skillhub.skill.controller;

import com.skillhub.skill.dto.EmployeeSkillDto;
import com.skillhub.skill.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/internal/skills")
@RequiredArgsConstructor
public class InternalSkillController {

    private final SkillService skillService;

    @GetMapping("/distribution")
    public ResponseEntity<Map<String, Long>> getDistribution() {
        return ResponseEntity.ok(skillService.getSkillDistribution());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeSkillDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(skillService.getSkillsByEmployeeId(employeeId));
    }
}
