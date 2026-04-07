package com.skillhub.skill.repository;

import com.skillhub.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findBySkillName(String skillName);
    boolean existsBySkillName(String skillName);
}
