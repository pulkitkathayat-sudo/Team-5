package com.skillhub.auth.dto;

import lombok.*;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserStatsDto {
    private long totalEmployees;
    private long totalManagers;
    private long totalAdmins;
    private long availableEmployees;
    private long onProjectEmployees;
}
