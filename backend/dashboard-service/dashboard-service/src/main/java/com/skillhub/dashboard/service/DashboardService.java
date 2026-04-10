package com.skillhub.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RestTemplate restTemplate;

    @SuppressWarnings("unchecked")
    public Map<String, Object> getStats() {
        Map<String, Object> result = new LinkedHashMap<>();

        // Get user stats from auth-service
        try {
            Map<String, Object> userStats = restTemplate.getForObject(
                    "http://AUTH-SERVICE/api/internal/users/stats", Map.class);
            result.put("totalEmployees", userStats.get("totalEmployees"));
            result.put("totalManagers", userStats.get("totalManagers"));
            result.put("totalAdmins", userStats.get("totalAdmins"));
            result.put("availableEmployees", userStats.get("availableEmployees"));
            result.put("onProjectEmployees", userStats.get("onProjectEmployees"));
        } catch (Exception e) {
            result.put("totalEmployees", 0);
            result.put("totalManagers", 0);
            result.put("totalAdmins", 0);
            result.put("availableEmployees", 0);
            result.put("onProjectEmployees", 0);
        }

        // Get project stats from project-service
        try {
            Map<String, Object> projectStats = restTemplate.getForObject(
                    "http://PROJECT-SERVICE/api/internal/projects/stats", Map.class);
            result.put("totalProjects", projectStats.get("totalProjects"));
            result.put("activeProjects", projectStats.get("activeProjects"));
        } catch (Exception e) {
            result.put("totalProjects", 0);
            result.put("activeProjects", 0);
        }

        // Get skill distribution from skill-service
        try {
            Map<String, Object> skillDist = restTemplate.getForObject(
                    "http://SKILL-SERVICE/api/internal/skills/distribution", Map.class);
            result.put("skillDistribution", skillDist);
        } catch (Exception e) {
            result.put("skillDistribution", new LinkedHashMap<>());
        }

        // Calculate utilization rate
        long totalEmployees = ((Number) result.getOrDefault("totalEmployees", 0)).longValue();
        long onProject = ((Number) result.getOrDefault("onProjectEmployees", 0)).longValue();
        double utilization = totalEmployees > 0 ? (double) onProject / totalEmployees * 100 : 0;
        result.put("utilizationRate", Math.round(utilization * 10.0) / 10.0);

        return result;
    }
}
