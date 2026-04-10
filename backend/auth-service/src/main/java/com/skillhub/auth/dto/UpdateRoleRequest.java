package com.skillhub.auth.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateRoleRequest {
    private String role;
}
