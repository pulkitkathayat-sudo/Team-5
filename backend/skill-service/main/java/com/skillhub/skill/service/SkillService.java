package com.skillhub.skill.service;

import com.skillhub.skill.dto.*;
import com.skillhub.skill.entity.*;
import com.skillhub.skill.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final RestTemplate restTemplate;

    public List<Map<String, Object>> getCatalog() {
        return skillRepository.findAll().stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("skillName", s.getSkillName());
            m.put("category", s.getCategory().name());
            return m;
        }).collect(Collectors.toList());
    }

    public List<EmployeeSkillDto> getMySkills(String email) {
        Long userId = getUserIdByEmail(email);
        return employeeSkillRepository.findByEmployeeId(userId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public EmployeeSkillDto addSkill(String email, AddSkillRequest request) {
        Long userId = getUserIdByEmail(email);
        if (employeeSkillRepository.existsByEmployeeIdAndSkillId(userId, request.getSkillId())) {
            throw new RuntimeException("Skill already added");
        }
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        EmployeeSkill es = EmployeeSkill.builder()
                .employeeId(userId)
                .skill(skill)
                .proficiency(request.getProficiency())
                .yearsOfExperience(request.getYearsOfExperience())
                .build();
        return mapToDto(employeeSkillRepository.save(es));
    }

    @Transactional
    public EmployeeSkillDto updateSkill(String email, Long id, AddSkillRequest request) {
        Long userId = getUserIdByEmail(email);
        EmployeeSkill es = employeeSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        if (!es.getEmployeeId().equals(userId)) throw new RuntimeException("Not authorized");
        es.setProficiency(request.getProficiency());
        es.setYearsOfExperience(request.getYearsOfExperience());
        return mapToDto(employeeSkillRepository.save(es));
    }

    @Transactional
    public void deleteSkill(String email, Long id) {
        Long userId = getUserIdByEmail(email);
        EmployeeSkill es = employeeSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        if (!es.getEmployeeId().equals(userId)) throw new RuntimeException("Not authorized");
        employeeSkillRepository.delete(es);
    }

    // For dashboard aggregation
    public Map<String, Long> getSkillDistribution() {
        return employeeSkillRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        es -> es.getSkill().getSkillName(),
                        Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (e1, e2) -> e1, LinkedHashMap::new));
    }

    // For search: get skills by employee IDs
    public List<EmployeeSkillDto> getSkillsByEmployeeId(Long employeeId) {
        return employeeSkillRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    private Long getUserIdByEmail(String email) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> user = restTemplate.getForObject(
                    "http://AUTH-SERVICE/api/internal/users/by-email/" + email, Map.class);
            return ((Number) user.get("id")).longValue();
        } catch (Exception e) {
            throw new RuntimeException("Could not resolve user from auth service: " + e.getMessage());
        }
    }

    private EmployeeSkillDto mapToDto(EmployeeSkill es) {
        return EmployeeSkillDto.builder()
                .id(es.getId())
                .skillId(es.getSkill().getId())
                .skillName(es.getSkill().getSkillName())
                .category(es.getSkill().getCategory().name())
                .proficiency(es.getProficiency())
                .yearsOfExperience(es.getYearsOfExperience())
                .build();
    }
}
