package za.ac.cput.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.Admin;
import za.ac.cput.dto.request.AdminRequest;
import za.ac.cput.dto.response.AdminResponse;
import za.ac.cput.factory.AdminFactory;
import za.ac.cput.repository.AdminRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/*
 * AdminService.java
 * Implementation of IAdminService with BCrypt hashing and DTO mapping
 * Author: Magdeline Malahlela (240281721)
 * Date: October 2026
 */
@Service
public class AdminService implements IAdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public AdminResponse create(AdminRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Admin request cannot be null.");
        }

        // 1. Check if email is already in use
        if (adminRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("An administrator with email " + request.email() + " already exists.");
        }

        // 2. Hash raw password with BCrypt
        String encodedPassword = passwordEncoder.encode(request.password());

        // 3. Build entity via AdminFactory
        Admin admin = AdminFactory.createAdmin(
                request.name().trim(),
                request.email().trim(),
                encodedPassword
        );

        if (admin == null) {
            throw new IllegalArgumentException("Admin validation failed. Verify that all fields are valid.");
        }

        // 4. Save and return mapped DTO
        Admin savedAdmin = adminRepository.save(admin);
        return mapToResponse(savedAdmin);
    }

    @Override
    public AdminResponse read(String adminId) {
        return adminRepository.findById(adminId)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    @Transactional
    public AdminResponse update(String adminId, AdminRequest request) {
        Admin existing = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Administrator not found with ID: " + adminId));

        // Email conflict check if changing email
        if (!existing.getEmail().equalsIgnoreCase(request.email())
                && adminRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email " + request.email() + " is already in use by another admin.");
        }

        // If new password provided, re-encode it; otherwise keep current hash
        String passwordToSave = (request.password() != null && !request.password().isBlank())
                ? passwordEncoder.encode(request.password())
                : existing.getPassword();

        Admin updatedAdmin = new Admin.Builder()
                .copy(existing)
                .setName(request.name().trim())
                .setEmail(request.email().trim())
                .setPassword(passwordToSave)
                .build();

        Admin saved = adminRepository.save(updatedAdmin);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public boolean delete(String adminId) {
        if (!adminRepository.existsById(adminId)) {
            return false;
        }
        adminRepository.deleteById(adminId);
        return true;
    }

    @Override
    public List<AdminResponse> getAll() {
        return adminRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AdminResponse> getByEmail(String email) {
        return adminRepository.findByEmail(email)
                .map(this::mapToResponse);
    }

    /**
     * Entity-to-DTO mapper (guarantees passwords are never leaked)
     */
    private AdminResponse mapToResponse(Admin admin) {
        return new AdminResponse(
                admin.getAdminId(),
                admin.getName(),
                admin.getEmail()
        );
    }
}