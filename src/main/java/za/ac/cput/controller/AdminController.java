package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.dto.request.AdminRequest;
import za.ac.cput.dto.response.AdminResponse;
import za.ac.cput.service.IAdminService;

import java.util.List;

/*
 * AdminController.java
 * REST API for Administrative operations with Method-Level RBAC Security
 * Author: Magdeline Malahlela (240281721) / Updated: Ebenezer Kouakou (230480152)
 * Date: October 2026
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Create a new administrator (e.g. secondary WIL Coordinator)
     */
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody AdminRequest request) {
        try {
            AdminResponse response = adminService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Read an administrator by admin ID
     */
    @GetMapping("/read/{adminId}")
    public ResponseEntity<AdminResponse> read(@PathVariable String adminId) {
        AdminResponse response = adminService.read(adminId);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Update an administrator's profile or password
     */
    @PutMapping("/update/{adminId}")
    public ResponseEntity<?> update(@PathVariable String adminId,
                                    @RequestBody AdminRequest request) {
        try {
            AdminResponse updated = adminService.update(adminId, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Delete an administrator account by ID
     */
    @DeleteMapping("/delete/{adminId}")
    public ResponseEntity<Void> delete(@PathVariable String adminId) {
        boolean deleted = adminService.delete(adminId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all registered administrators
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<AdminResponse>> getAll() {
        return ResponseEntity.ok(adminService.getAll());
    }

    /**
     * Lookup administrator by email
     */
    @GetMapping("/getByEmail")
    public ResponseEntity<AdminResponse> getByEmail(@RequestParam String email) {
        return adminService.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}