package com.skillhub.auth.service;

import com.skillhub.auth.dto.UserProfileDto;
import com.skillhub.auth.dto.UserStatsDto;
import com.skillhub.auth.entity.User;
import com.skillhub.auth.enums.AvailabilityStatus;
import com.skillhub.auth.enums.Role;
import com.skillhub.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public UserProfileDto getProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public UserProfileDto getProfileByEmailInternal(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UserProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getDesignation() != null) user.setDesignation(dto.getDesignation());
        if (dto.getDepartment() != null) user.setDepartment(dto.getDepartment());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Transactional
    public void updateAvailability(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvailabilityStatus(AvailabilityStatus.valueOf(status));
        userRepository.save(user);
    }

    // Admin methods
    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public void updateRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(role));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Search
    public List<UserProfileDto> searchUsers(String name, String department, String availability) {
        List<User> employees = userRepository.findByRole(Role.EMPLOYEE);
        return employees.stream()
                .filter(u -> name == null || name.isBlank() || u.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(u -> department == null || department.isBlank() || (u.getDepartment() != null && u.getDepartment().toLowerCase().contains(department.toLowerCase())))
                .filter(u -> {
                    if (availability == null || availability.isBlank() || availability.equals("ALL")) return true;
                    try {
                        return u.getAvailabilityStatus() == AvailabilityStatus.valueOf(availability);
                    } catch (IllegalArgumentException e) { return true; }
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Stats for dashboard service
    public UserStatsDto getStats() {
        return UserStatsDto.builder()
                .totalEmployees(userRepository.countByRole(Role.EMPLOYEE))
                .totalManagers(userRepository.countByRole(Role.MANAGER))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .availableEmployees(userRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE))
                .onProjectEmployees(userRepository.countByAvailabilityStatus(AvailabilityStatus.ON_PROJECT))
                .build();
    }

    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .designation(user.getDesignation())
                .department(user.getDepartment())
                .phone(user.getPhone())
                .availabilityStatus(user.getAvailabilityStatus().name())
                .build();
    }
}
