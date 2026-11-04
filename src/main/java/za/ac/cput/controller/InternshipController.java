package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.WorkMode;
import za.ac.cput.dto.request.InternshipSearchCriteria;
import za.ac.cput.dto.response.InternshipResponse;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.InternshipRepository;
import za.ac.cput.service.IInternshipService;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/internship")
@CrossOrigin(origins = "http://localhost:5173")
public class InternshipController {

    private final IInternshipService internshipService;
    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;

    public InternshipController(IInternshipService internshipService,
                                InternshipRepository internshipRepository,
                                CompanyRepository companyRepository) {
        this.internshipService = internshipService;
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<?> create(@RequestBody Internship internship, Authentication authentication) {
        if (isCompany(authentication)) {
            internship.setCompanyId(getCompanyId(authentication)); // Force company ownership from token
        }
        Internship created = internshipService.create(internship);
        if (created == null) {
            return ResponseEntity.badRequest()
                    .body("Could not post internship. Check that all required fields are filled in and the deadline is in the future.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/read/{internshipId}")
    public ResponseEntity<Internship> read(@PathVariable String internshipId) {
        Internship internship = internshipService.read(internshipId);
        if (internship == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(internship);
    }

    /** Public listing details including company name and applicant count. */
    @GetMapping("/details/{internshipId}")
    public ResponseEntity<InternshipResponse> details(@PathVariable String internshipId) {
        InternshipResponse response = internshipService.getDetails(internshipId);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Public, server-side search.
     * Example: /api/internship/search?q=java&location=cape&workMode=HYBRID&paidOnly=true&openOnly=true&sort=deadline
     */
    @GetMapping("/search")
    public List<InternshipResponse> search(@RequestParam(required = false) String q,
                                           @RequestParam(required = false) String location,
                                           @RequestParam(required = false) WorkMode workMode,
                                           @RequestParam(required = false) String field,
                                           @RequestParam(defaultValue = "false") boolean paidOnly,
                                           @RequestParam(defaultValue = "false") boolean openOnly,
                                           @RequestParam(required = false) String sort,
                                           @RequestParam(required = false) Integer limit) {
        return internshipService.search(
                new InternshipSearchCriteria(q, location, workMode, field, paidOnly, openOnly, sort, limit));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<Internship> update(@RequestBody Internship internship, Authentication authentication) {
        Internship existing = internshipService.read(internship.getInternshipId());
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (isCompany(authentication)) {
            String companyId = getCompanyId(authentication);
            if (!existing.getCompanyId().equals(companyId)) {
                throw new AccessDeniedException("Access Denied: You can only edit your own internship postings.");
            }
            internship.setCompanyId(companyId);
        } else if (internship.getCompanyId() == null) {
            internship.setCompanyId(existing.getCompanyId());
        }

        return ResponseEntity.ok(internshipService.update(internship));
    }

    @DeleteMapping("/delete/{internshipId}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean delete(@PathVariable String internshipId) {
        return internshipService.delete(internshipId);
    }

    @GetMapping("/getAll")
    public List<Internship> getAll() {
        return internshipService.getAll();
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<List<Internship>> getByCompany(@PathVariable String companyId, Authentication authentication) {
        if (isCompany(authentication) && !getCompanyId(authentication).equals(companyId)) {
            throw new AccessDeniedException("Access Denied: Cannot view other company management postings.");
        }
        return ResponseEntity.ok(internshipRepository.findByCompanyId(companyId));
    }

    @GetMapping("/getByLocation")
    public List<Internship> getByLocation(@RequestParam String location) {
        return internshipService.getInternshipsByLocation(location);
    }

    @GetMapping("/getByTitle")
    public List<Internship> getByTitle(@RequestParam String title) {
        return internshipService.getInternshipsByTitle(title);
    }

    private String getCompanyId(Authentication authentication) {
        return companyRepository.findByContactEmail(authentication.getName())
                .map(c -> c.getCompanyId())
                .orElseThrow(() -> new AccessDeniedException("Company record not found."));
    }

    private boolean isCompany(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_COMPANY"));
    }
}