package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.ApplicationStatus;
import za.ac.cput.domain.Company;
import za.ac.cput.dto.response.ApplicationResponse;
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

    public record ApplicationRequest(String studentNumber, String internshipId, String coverLetter) {
        public ApplicationRequest(String studentNumber, String internshipId) {
            this(studentNumber, internshipId, null);
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> create(@RequestBody ApplicationRequest request,
                                    Authentication authentication) {
        requireStudentOwner(request.studentNumber(), authentication);
        try {
            Application created = applicationService.apply(
                    request.studentNumber(),
                    request.internshipId(),
                    request.coverLetter()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.toResponse(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{applicationId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> read(@PathVariable String applicationId,
                                                    Authentication authentication) {
        Optional<Application> application = applicationService.read(applicationId);

        if (application.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (isStudent(authentication) && !application.get().getStudent().getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException("Access Denied: You may only view your own applications.");
        }

        if (isCompany(authentication)) {
            String companyId = getAuthenticatedCompanyId(authentication);
            if (!application.get().getInternship().getCompanyId().equals(companyId)) {
                throw new AccessDeniedException("Access Denied: You do not own the internship for this application.");
            }
        }

        return ResponseEntity.ok(applicationService.toResponse(application.get()));
    }

    @PutMapping("/update/{applicationId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String applicationId,
                                          @RequestParam String status,
                                          Authentication authentication) {
        Application existing = applicationService.read(applicationId).orElse(null);

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
            Application updated = applicationService.updateStatus(applicationId, ApplicationStatus.fromString(status));
            return ResponseEntity.ok(applicationService.toResponse(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/withdraw/{applicationId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> withdraw(@PathVariable String applicationId, Authentication authentication) {
        Application existing = applicationService.read(applicationId).orElse(null);
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }
        requireStudentOwner(existing.getStudent().getStudentNumber(), authentication);
        try {
            return ResponseEntity.ok(applicationService.toResponse(applicationService.withdraw(applicationId)));
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
    public ResponseEntity<List<ApplicationResponse>> getAll() {
        return ResponseEntity.ok(applicationService.toResponses(applicationService.readAll()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getByStudent(@PathVariable String studentId,
                                                                  Authentication authentication) {
        requireStudentOwner(studentId, authentication);
        return ResponseEntity.ok(applicationService.toResponses(applicationService.readByStudent(studentId)));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getByCompany(@PathVariable String companyId,
                                                                  Authentication authentication) {
        if (isCompany(authentication)) {
            String authCompanyId = getAuthenticatedCompanyId(authentication);
            if (!authCompanyId.equals(companyId)) {
                throw new AccessDeniedException("Access Denied: You cannot view applicants belonging to another company.");
            }
        }
        return ResponseEntity.ok(applicationService.toResponses(applicationService.readByCompany(companyId)));
    }

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getByInternship(@PathVariable String internshipId,
                                                                     Authentication authentication) {
        List<Application> applications = applicationService.readByInternship(internshipId);
        if (isCompany(authentication)) {
            String companyId = getAuthenticatedCompanyId(authentication);
            applications = applications.stream()
                    .filter(a -> companyId.equals(a.getInternship().getCompanyId()))
                    .toList();
        }
        return ResponseEntity.ok(applicationService.toResponses(applications));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getByStatus(@PathVariable String status) {
        try {
            ApplicationStatus parsed = ApplicationStatus.fromString(status);
            return ResponseEntity.ok(applicationService.toResponses(applicationService.readByStatus(parsed)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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

    private static boolean hasRole(Authentication authentication, String role) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), role));
    }

    private boolean isAdmin(Authentication authentication) {
        return hasRole(authentication, "ROLE_ADMIN");
    }

    private boolean isStudent(Authentication authentication) {
        return hasRole(authentication, "ROLE_STUDENT");
    }

    private boolean isCompany(Authentication authentication) {
        return hasRole(authentication, "ROLE_COMPANY");
    }
}