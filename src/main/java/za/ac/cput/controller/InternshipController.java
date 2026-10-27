
package za.ac.cput.controller;

/*
InternshipController.java
Internship REST Controller
Author: Refilwe Mabena (231013051)
Date: 27 October 2026
*/

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import za.ac.cput.domain.Internship;
import za.ac.cput.dto.request.InternshipRequest;
import za.ac.cput.dto.response.InternshipResponse;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.InternshipRepository;
import za.ac.cput.service.IInternshipService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/internship")
@CrossOrigin(origins = "http://localhost:5173")
public class InternshipController {

    private final IInternshipService internshipService;
    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;

    public InternshipController(
            IInternshipService internshipService,
            InternshipRepository internshipRepository,
            CompanyRepository companyRepository) {
        this.internshipService = internshipService;
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<InternshipResponse> create(
            @RequestBody InternshipRequest request,
            Authentication authentication) {

        InternshipResponse response;

        if (isCompany(authentication)) {
            String companyId = getCompanyId(authentication);
            response = internshipService.create(request, companyId);
        } else {
            response = internshipService.create(request);
        }

        if (response == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/read/{internshipId}")
    public ResponseEntity<InternshipResponse> read(
            @PathVariable String internshipId) {

        InternshipResponse response = internshipService.read(internshipId);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{internshipId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<InternshipResponse> update(
            @PathVariable String internshipId,
            @RequestBody InternshipRequest request,
            Authentication authentication) {

        Internship existing = internshipRepository
                .findById(internshipId)
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        if (isCompany(authentication)) {
            String companyId = getCompanyId(authentication);

            if (!Objects.equals(existing.getCompanyId(), companyId)) {
                throw new AccessDeniedException(
                        "You can only edit your own internship postings.");
            }
        }

        InternshipResponse response =
                internshipService.update(internshipId, request);

        if (response == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{internshipId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable String internshipId) {

        if (!internshipService.delete(internshipId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    public List<InternshipResponse> getAll() {
        return internshipService.getAll();
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<List<InternshipResponse>> getByCompany(
            @PathVariable String companyId,
            Authentication authentication) {

        if (isCompany(authentication)
                && !Objects.equals(getCompanyId(authentication), companyId)) {
            throw new AccessDeniedException(
                    "Cannot view another company's internship postings.");
        }

        List<InternshipResponse> responses = internshipRepository
                .findByCompanyId(companyId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/getByLocation")
    public List<InternshipResponse> getByLocation(
            @RequestParam String location) {
        return internshipService.getInternshipsByLocation(location);
    }

    @GetMapping("/getByTitle")
    public List<InternshipResponse> getByTitle(
            @RequestParam String title) {
        return internshipService.getInternshipsByTitle(title);
    }

    @GetMapping("/getUpcoming")
    public List<InternshipResponse> getUpcoming() {
        return internshipService.getUpcomingInternships(
                LocalDateTime.now());
    }

    private String getCompanyId(Authentication authentication) {
        return companyRepository.findByContactEmail(authentication.getName())
                .map(company -> company.getCompanyId())
                .orElseThrow(() ->
                        new AccessDeniedException("Company record not found."));
    }

    private boolean isCompany(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        Objects.equals(authority.getAuthority(), "ROLE_COMPANY"));
    }

    private InternshipResponse toResponse(Internship internship) {
        boolean active = internship.getDeadline() != null
                && internship.getDeadline().isAfter(LocalDateTime.now());

        return new InternshipResponse(
                internship.getInternshipId(),
                internship.getTitle(),
                internship.getDescription(),
                internship.getLocation(),
                internship.getDeadline(),
                active
        );
    }
}
