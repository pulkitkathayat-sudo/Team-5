package com.skillhub.auth.controller;

import com.skillhub.auth.dto.*;
import com.skillhub.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> updateRole(@PathVariable Long id, @RequestBody UpdateRoleRequest request) {
        userService.updateRole(id, request.getRole());
        return ResponseEntity.ok(new ApiResponse(true, "Role updated"));
    }

    @PutMapping("/users/{id}/availability")
    public ResponseEntity<ApiResponse> updateAvailability(@PathVariable Long id, @RequestParam String status) {
        userService.updateAvailability(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Availability updated"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse(true, "User deleted"));
    }
}
