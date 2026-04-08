package com.skillhub.auth.controller;

import com.skillhub.auth.dto.*;
import com.skillhub.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfileByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(Authentication authentication,
                                                         @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), dto));
    }
}
