package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Company;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.service.ApplicationService;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CompanyRepository companyRepository;

    public ApplicationController(ApplicationService applicationService, CompanyRepository companyRepository) {
        this.applicationService = applicationService;
        this.companyRepository = companyRepository;
    }

    public record ApplicationRequest(String studentNumber, String internshipId) {}

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> create(@RequestBody ApplicationRequest request,
                                    Authentication authentication) {
        requireStudentOwner(request.studentNumber(), authentication);
        try {
            Application created = applicationService.apply(
                    request.studentNumber(),
                    request.internshipId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{applicationId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')")
    public ResponseEntity<Application> read(@PathVariable String applicationId,
                                            Authentication authentication) {
        Optional<Application> application = applicationService.read(applicationId);

        if (application.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Student owner check
        if (isStudent(authentication) && !application.get().getStudent().getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException("Access Denied: You may only view your own applications.");
        }

        // Company owner check
        if (isCompany(authentication)) {
            String companyId = getAuthenticatedCompanyId(authentication);
            if (!application.get().getInternship().getCompanyId().equals(companyId)) {
                throw new AccessDeniedException("Access Denied: You do not own the internship for this application.");
            }
        }

        return ResponseEntity.ok(application.get());
    }

    @PutMapping("/update/{applicationId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String applicationId,
                                          @RequestParam String status,
                                          Authentication authentication) {
        Application existing = applicationService.read(applicationId)
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }

        if (isCompany(authentication)) {
            String companyId = getAuthenticatedCompanyId(authentication);
            if (!existing.getInternship().getCompanyId().equals(companyId)) {
                throw new AccessDeniedException("Access Denied: You can only update applications for your own listings.");
            }
        }

        try {
            Application updated = applicationService.updateStatus(applicationId, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{applicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String applicationId) {
        try {
            applicationService.delete(applicationId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getAll() {
        return ResponseEntity.ok(applicationService.readAll());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Application>> getByStudent(@PathVariable String studentId,
                                                          Authentication authentication) {
        requireStudentOwner(studentId, authentication);
        return ResponseEntity.ok(applicationService.readByStudent(studentId));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<List<Application>> getByCompany(@PathVariable String companyId,
                                                          Authentication authentication) {
        if (isCompany(authentication)) {
            String authCompanyId = getAuthenticatedCompanyId(authentication);
            if (!authCompanyId.equals(companyId)) {
                throw new AccessDeniedException("Access Denied: You cannot view applicants belonging to another company.");
            }
        }
        return ResponseEntity.ok(applicationService.readByCompany(companyId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(applicationService.readByStatus(status));
    }

    private void requireStudentOwner(String studentNumber, Authentication authentication) {
        if (!isAdmin(authentication) && !applicationService.isStudentOwner(studentNumber, authentication.getName())) {
            throw new AccessDeniedException("Access Denied: You may only access your own applications.");
        }
    }

    private String getAuthenticatedCompanyId(Authentication authentication) {
        return companyRepository.findByContactEmail(authentication.getName())
                .map(Company::getCompanyId)
                .orElseThrow(() -> new AccessDeniedException("Authenticated company record not found."));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_ADMIN"));
    }

    private boolean isStudent(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_STUDENT"));
    }

    private boolean isCompany(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_COMPANY"));
    }
}