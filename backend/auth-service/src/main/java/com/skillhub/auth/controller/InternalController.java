package com.skillhub.auth.controller;

import com.skillhub.auth.dto.*;
import com.skillhub.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal")
@RequiredArgsConstructor
public class InternalController {

    private final UserService userService;

    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getProfileById(id));
    }

    @GetMapping("/users/by-email/{email}")
    public ResponseEntity<UserProfileDto> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getProfileByEmailInternal(email));
    }

    @PutMapping("/users/{id}/availability")
    public ResponseEntity<ApiResponse> updateAvailability(@PathVariable Long id, @RequestParam String status) {
        userService.updateAvailability(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Updated"));
    }

    @GetMapping("/users/stats")
    public ResponseEntity<UserStatsDto> getUserStats() {
        return ResponseEntity.ok(userService.getStats());
    }
}
