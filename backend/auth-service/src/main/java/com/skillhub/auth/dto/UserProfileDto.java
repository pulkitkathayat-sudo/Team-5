package com.skillhub.auth.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String designation;
    private String department;
    private String phone;
    private String availabilityStatus;
}
