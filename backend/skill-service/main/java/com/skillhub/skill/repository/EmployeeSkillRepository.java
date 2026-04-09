package com.skillhub.skill.repository;

import com.skillhub.skill.entity.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Long> {
    List<EmployeeSkill> findByEmployeeId(Long employeeId);
    boolean existsByEmployeeIdAndSkillId(Long employeeId, Long skillId);
}
