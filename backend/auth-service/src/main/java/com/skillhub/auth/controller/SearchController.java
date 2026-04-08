package com.skillhub.auth.controller;

import com.skillhub.auth.dto.UserProfileDto;
import com.skillhub.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
@RequiredArgsConstructor
public class SearchController {

    private final UserService userService;

    @GetMapping("/employees")
    public ResponseEntity<List<UserProfileDto>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String availability) {
        return ResponseEntity.ok(userService.searchUsers(name, department, availability));
    }
}
