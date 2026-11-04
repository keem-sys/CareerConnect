package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.dto.request.StudentRegistrationRequest;
import za.ac.cput.dto.request.StudentUpdateRequest;
import za.ac.cput.dto.response.StudentResponse;
import za.ac.cput.service.IStudentService;

import java.util.List;
import java.util.Objects;

/*
 * StudentController.java
 * REST API for Student operations with Method-Level RBAC Security
 * Author: Ebenezer Kouakou (230480152)
 * Date: 18 October 2026
 */
@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final IStudentService studentService;

    public StudentController(IStudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody StudentRegistrationRequest request) {
        try {
            StudentResponse response = studentService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{studentNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<StudentResponse> read(@PathVariable String studentNumber,
                                                Authentication authentication) {
        requireStudentOrAdmin(studentNumber, authentication);
        StudentResponse response = studentService.read(studentNumber);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{studentNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<?> update(@PathVariable String studentNumber,
                                    @RequestBody StudentUpdateRequest request,
                                    Authentication authentication) {
        requireStudentOrAdmin(studentNumber, authentication);
        StudentResponse current = studentService.read(studentNumber);
        if (current != null && !isAdmin(authentication)
                && !current.email().equalsIgnoreCase(request.email())) {
            throw new AccessDeniedException("Students may not change their account email.");
        }
        try {
            StudentResponse updated = studentService.update(studentNumber, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{studentNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String studentNumber) {
        boolean deleted = studentService.delete(studentNumber);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponse>> getAll() {
        return ResponseEntity.ok(studentService.getAll());
    }

    @GetMapping("/getByEmail")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<StudentResponse> getByEmail(@RequestParam String email,
                                                      Authentication authentication) {
        if (!isAdmin(authentication) && !email.equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException("Students may only read their own profile.");
        }
        return studentService.getStudentByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/getByName")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponse>> getByName(@RequestParam String name) {
        return ResponseEntity.ok(studentService.getStudentsByName(name));
    }

    private void requireStudentOrAdmin(String studentNumber, Authentication authentication) {
        if (isAdmin(authentication)) {
            return;
        }
        StudentResponse student = studentService.read(studentNumber);
        if (student == null || !student.email().equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException("Students may only access their own profile.");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> Objects.equals(authority.getAuthority(), "ROLE_ADMIN"));
    }
}