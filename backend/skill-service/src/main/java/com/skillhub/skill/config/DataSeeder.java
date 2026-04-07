package com.skillhub.skill.config;

import com.skillhub.skill.entity.Skill;
import com.skillhub.skill.enums.SkillCategory;
import com.skillhub.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SkillRepository skillRepository;

    @Override
    public void run(String... args) {
        if (skillRepository.count() > 0) return;

        seed("Java", SkillCategory.LANGUAGE);
        seed("Python", SkillCategory.LANGUAGE);
        seed("JavaScript", SkillCategory.LANGUAGE);
        seed("TypeScript", SkillCategory.LANGUAGE);
        seed("C++", SkillCategory.LANGUAGE);
        seed("Go", SkillCategory.LANGUAGE);
        seed("Rust", SkillCategory.LANGUAGE);
        seed("Kotlin", SkillCategory.LANGUAGE);
        seed("Swift", SkillCategory.LANGUAGE);
        seed("Ruby", SkillCategory.LANGUAGE);

        seed("React", SkillCategory.FRAMEWORK);
        seed("Angular", SkillCategory.FRAMEWORK);
        seed("Vue.js", SkillCategory.FRAMEWORK);
        seed("Spring Boot", SkillCategory.FRAMEWORK);
        seed("Node.js", SkillCategory.FRAMEWORK);
        seed("Django", SkillCategory.FRAMEWORK);
        seed(".NET", SkillCategory.FRAMEWORK);
        seed("Flutter", SkillCategory.FRAMEWORK);

        seed("PostgreSQL", SkillCategory.DATABASE);
        seed("MySQL", SkillCategory.DATABASE);
        seed("MongoDB", SkillCategory.DATABASE);
        seed("Redis", SkillCategory.DATABASE);
        seed("Elasticsearch", SkillCategory.DATABASE);
        seed("Cassandra", SkillCategory.DATABASE);
        seed("Oracle", SkillCategory.DATABASE);

        seed("Docker", SkillCategory.TOOL);
        seed("Kubernetes", SkillCategory.TOOL);
        seed("Jenkins", SkillCategory.TOOL);
        seed("Git", SkillCategory.TOOL);
        seed("Terraform", SkillCategory.TOOL);
        seed("Ansible", SkillCategory.TOOL);
        seed("Jira", SkillCategory.TOOL);

        seed("AWS", SkillCategory.CLOUD);
        seed("Azure", SkillCategory.CLOUD);
        seed("GCP", SkillCategory.CLOUD);
        seed("Heroku", SkillCategory.CLOUD);
    }

    private void seed(String name, SkillCategory category) {
        if (!skillRepository.existsBySkillName(name)) {
            skillRepository.save(Skill.builder().skillName(name).category(category).build());
        }
    }
}
